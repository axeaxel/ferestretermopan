import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { chromium } from "playwright";

const base = process.env.SITE_URL ?? "http://127.0.0.1:8080";
const PHONE_TEL = "tel:+40731289684";
const REVIEWS = "https://maps.app.goo.gl/xJoRZhgDbfJ1PGMSA";

let browser;

before(async () => {
  const probe = await fetch(base, { signal: AbortSignal.timeout(4000) }).catch(() => null);
  if (!probe?.ok) {
    throw new Error(`Site is not running at ${base}. Start it, then run npm run test:site.`);
  }
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
});

function attachMonitors(page) {
  const pageErrors = [];
  const consoleErrors = [];
  const failedSameOrigin = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (/youtube|googlevideo|google\.com\/maps|gstatic|doubleclick|compute-pressure/i.test(text)) return;
    consoleErrors.push(text);
  });
  page.on("requestfailed", (request) => {
    const url = request.url();
    if (!url.startsWith(base)) return;
    failedSameOrigin.push(`${url} (${request.failure()?.errorText ?? "failed"})`);
  });
  return { pageErrors, consoleErrors, failedSameOrigin };
}

function assertClean(monitors, label) {
  assert.deepEqual(monitors.pageErrors, [], `${label} page errors`);
  assert.deepEqual(monitors.consoleErrors, [], `${label} console errors`);
  assert.deepEqual(monitors.failedSameOrigin, [], `${label} failed assets`);
}

async function openPage(viewport) {
  const page = await browser.newPage({ viewport });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const monitors = attachMonitors(page);
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.waitForFunction(() => {
    const form = document.querySelector("#contact form");
    return !!form && Object.keys(form).some((key) => key.startsWith("__reactProps"));
  });
  return { page, monitors };
}

test("homepage shows the logo, headline, and photos", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    const heading = page.getByRole("heading", { level: 1 });
    await heading.waitFor();
    const box = await heading.boundingBox();
    assert.ok(box && box.width > 200 && box.height > 30, "headline is not visible");
    assert.match(await heading.textContent(), /Tâmplărie PVC și aluminiu/);

    const logo = page.locator("header img").first();
    assert.ok((await logo.boundingBox())?.width > 20, "header logo is missing");
    const hero = page.locator("img[alt*='Feronerie']");
    await hero.waitFor();
    assert.equal(
      await hero.evaluate((img) => img.complete && img.naturalWidth > 0),
      true,
      "hero photo did not load",
    );

    const broken = await page.evaluate(() =>
      [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
    );
    assert.deepEqual(broken, []);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    assert.equal(overflow, false, "page scrolls sideways");
    assertClean(monitors, "homepage");
  } finally {
    await page.close();
  }
});

test("header links scroll to the right sections", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    const nav = page.getByRole("navigation", { name: "Principal" });
    for (const [label, id] of [
      ["Servicii", "servicii"],
      ["Video", "video"],
      ["Lucrări", "lucrari"],
      ["Întrebări", "intrebari"],
      ["Contact", "contact"],
    ]) {
      await nav.getByRole("link", { name: label }).click();
      await page.waitForFunction((id) => {
        const top = document.getElementById(id)?.getBoundingClientRect().top ?? 9999;
        return location.hash === `#${id}` && top >= 0 && top < 180;
      }, id);
    }
    assertClean(monitors, "header links");
  } finally {
    await page.close();
  }
});

test("phone, offer, and Google links point at the right places", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    const phone = page.locator(`a[href="${PHONE_TEL}"]`);
    assert.ok((await phone.count()) >= 2, "phone links missing");
    assert.ok((await phone.first().boundingBox())?.height >= 40, "phone button is too small");

    await page.locator('a[href="#contact"]').first().click();
    await page.waitForFunction(() => location.hash === "#contact");

    const reviews = page.locator(`a[href="${REVIEWS}"]`);
    await reviews.waitFor();
    assert.equal(await reviews.getAttribute("target"), "_blank");
    assert.match(await reviews.textContent(), /vezi profilul/i);

    const map = page.getByRole("link", { name: "Deschide harta" });
    assert.match(await map.getAttribute("href"), /google\.com\/maps/);
    assert.equal(await map.getAttribute("target"), "_blank");

    const mail = page.locator('a[href="mailto:gigichircu@yahoo.com"]');
    assert.ok((await mail.count()) >= 1);
    assertClean(monitors, "links");
  } finally {
    await page.close();
  }
});

test("a request without a message stays on the page", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 900 });
  try {
    const form = page.locator("#contact form");
    await form.scrollIntoViewIfNeeded();
    await form.locator('input[name="name"]').fill("Maria Ionescu");
    await form.locator('input[name="phone"]').fill("0731 289 684");
    await form.locator('input[name="email"]').fill("maria@example.com");
    await form.locator("select").selectOption({ label: "Plase insecte" });
    await form.locator("textarea").fill("");
    await form.getByRole("button", { name: "Pregătește cererea" }).click();

    await page.getByText("Mesajul este pregătit").waitFor();
    assert.equal(new URL(page.url()).search, "");
    assert.equal(await page.getByText("Ceva nu a mers").count(), 0);
    const body = await page.locator("#contact pre").innerText();
    assert.match(body, /Maria Ionescu/);
    assert.match(body, /0731 289 684/);
    assert.match(body, /maria@example.com/);
    assert.match(body, /Plase insecte/);
    assert.doesNotMatch(body, /Ce ai nevoie/);

    const whatsapp = await page.getByRole("link", { name: "Trimite pe WhatsApp" }).getAttribute("href");
    const mailto = await page.getByRole("link", { name: "Deschide emailul" }).getAttribute("href");
    assert.doesNotThrow(() => new URL(whatsapp));
    assert.doesNotThrow(() => new URL(mailto));
    assert.match(decodeURIComponent(whatsapp.split("text=")[1]), /Maria Ionescu/);

    await page.getByRole("button", { name: "Scrie altă cerere" }).click();
    await form.waitFor();

    await form.locator('input[name="name"]').fill("Ion Popescu");
    await form.locator('input[name="phone"]').fill("+40 731 289 684");
    await form.locator("textarea").fill("   ");
    await form.locator('input[name="email"]').press("Enter");
    await page.getByText("Mesajul este pregătit").waitFor();
    assert.match(await page.locator("#contact pre").innerText(), /Ion Popescu/);
    assert.equal(new URL(page.url()).search, "");
    assertClean(monitors, "empty message");
  } finally {
    await page.close();
  }
});

test("contact form rejects bad input and prepares a real request", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 900 });
  try {
    await page.locator("#contact").scrollIntoViewIfNeeded();
    const form = page.locator("#contact form");
    const submit = form.getByRole("button", { name: "Pregătește cererea" });

    await form.locator('input[name="name"]').fill("A");
    await form.locator('input[name="phone"]').fill("123");
    await submit.click();
    await page.getByRole("alert").waitFor();
    assert.equal((await page.getByRole("alert").textContent())?.trim(), "Spune-ne cum te cheamă.");

    await form.locator('input[name="name"]').fill("Ion Popescu");
    await form.locator('input[name="phone"]').fill("0731");
    await submit.click();
    assert.match(await page.getByRole("alert").textContent(), /număr de telefon/);

    await form.locator('input[name="phone"]').fill("0731123456");
    await form.locator('input[name="email"]').fill("nu-e-email");
    await submit.click();
    assert.match(await page.getByRole("alert").textContent(), /Emailul nu pare complet/);

    await form.locator('input[name="email"]').fill("ion@example.com");
    await form.locator("textarea").fill("4 ferestre PVC, Sector 3");
    await submit.click();

    await page.getByText("Mesajul este pregătit").waitFor();
    const body = await page.locator("#contact pre").textContent();
    assert.match(body, /Ion Popescu/);
    assert.match(body, /0731123456/);
    assert.match(body, /ion@example.com/);
    assert.match(body, /4 ferestre PVC/);

    const whatsapp = page.getByRole("link", { name: "Trimite pe WhatsApp" });
    assert.match(await whatsapp.getAttribute("href"), /^https:\/\/wa\.me\/40731289684\?text=/);
    const mailto = page.getByRole("link", { name: "Deschide emailul" });
    assert.match(await mailto.getAttribute("href"), /^mailto:gigichircu@yahoo.com\?/);

    await page.getByRole("button", { name: "Scrie altă cerere" }).click();
    await form.waitFor();
    assert.equal(await form.locator('input[name="name"]').inputValue(), "");
    assertClean(monitors, "contact form");
  } finally {
    await page.close();
  }
});

test("a work photo opens and closes", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    await page.locator("#lucrari button").first().click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    const photo = dialog.locator("img");
    assert.equal(await photo.evaluate((img) => img.naturalWidth > 0), true);
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assertClean(monitors, "gallery");
  } finally {
    await page.close();
  }
});

test("mobile menu opens and the page does not overflow", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 390, height: 844 });
  try {
    await page.getByRole("button", { name: "Deschide meniul" }).click();
    const menu = page.getByRole("navigation", { name: "Mobil" });
    await menu.getByRole("link", { name: "Contact" }).click();
    await page.waitForFunction(() => location.hash === "#contact");
    assert.equal(await page.getByRole("navigation", { name: "Mobil" }).count(), 0, "menu stayed open");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    assert.equal(overflow, false);
    const call = page.locator(".fixed a[href='tel:+40731289684']");
    assert.ok((await call.boundingBox())?.height >= 44, "mobile call button is missing");
    assertClean(monitors, "mobile");
  } finally {
    await page.close();
  }
});

test("legal page opens from the footer", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    await page.getByRole("link", { name: "Confidențialitate" }).click();
    await page.waitForURL(/\/legal/);
    await page.getByRole("heading", { name: "Informații legale" }).waitFor();
    await page.getByRole("heading", { name: "Confidențialitate" }).waitFor();
    await page.getByRole("heading", { name: "Termeni" }).waitFor();
    await page.getByRole("heading", { name: "Cookie-uri" }).waitFor();
    assertClean(monitors, "legal");
  } finally {
    await page.close();
  }
});
