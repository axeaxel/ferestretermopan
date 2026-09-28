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

    const business = await page.evaluate(() => {
      const node = document.querySelector('script[type="application/ld+json"]');
      return node ? JSON.parse(node.textContent) : null;
    });
    const company = business?.["@graph"]?.find((item) => item["@type"] === "HomeAndConstructionBusiness");
    assert.equal(company?.telephone, "+40731289684");
    assert.match(company?.address?.streetAddress ?? "", /Theodor Pallady nr\. 37/);
    assert.equal(company?.address?.addressLocality, "București");

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
    const row = page.locator("#lucrari ul");
    const before = await row.evaluate((el) => el.scrollLeft);
    await page.getByRole("button", { name: "Lucrările următoare" }).click();
    await page.waitForTimeout(400);
    const after = await row.evaluate((el) => el.scrollLeft);
    assert.ok(after > before, "carousel did not move");
    await page.locator("#lucrari ul button").first().click();
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
    assert.doesNotMatch(await page.locator("body").innerText(), /€|\beuro\b/i);
    assertClean(monitors, "legal");
  } finally {
    await page.close();
  }
});

test("search title, heading size, and the facts row", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    assert.equal(await page.title(), "Ferestre Termopan București | Europlay Alco");
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    assert.match(description, /Europlay Alco/);
    assert.match(description, /ferestretermopan\.ro/);
    assert.match(description, /0731 289 684/);
    assert.ok(description.length >= 80 && description.length <= 170, description);
    assert.equal(await page.locator("html").getAttribute("lang"), "ro");

    const heading = page.getByRole("heading", { level: 1 });
    assert.equal((await heading.textContent())?.trim(), "Tâmplărie PVC și aluminiu în București");
    assert.equal(await page.getByRole("heading", { level: 1 }).count(), 1);
    const headingSize = await heading.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    assert.ok(headingSize >= 40 && headingSize <= 52, `h1 is ${headingSize}px`);
    const leadSize = await page
      .locator("h1 + p")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    assert.equal(leadSize, 16);
    assert.doesNotMatch(await page.locator("body").innerText(), /€|\beuro\b/i);
    await page.getByRole("heading", { name: "Încredere" }).waitFor();
    assert.match(await page.locator("body").innerText(), /ferestretermopan\.ro este site-ul oficial al Europlay Alco SRL/);
    assert.match(await page.locator("#contact").innerText(), /Pallady nr\. 37/);
    assert.match(await page.locator("#contact").innerText(), /0731 289 684/);
    assert.doesNotMatch(await page.locator("body").innerText(), /deviz în lei/i);
    assert.doesNotMatch(await page.locator("body").innerText(), /De peste 25 de ani montăm/);
    assert.match(await page.locator("#video").innerText(), /Clipul de prezentare al firmei\./);
    assert.doesNotMatch(await page.locator("#video").innerText(), /site-ul vechi|vechi/i);
    assertClean(monitors, "seo");
  } finally {
    await page.close();
  }
});

test("partner logos load and do not overlap", { timeout: 30000 }, async () => {
  const names = ["ALUMIL", "GEALAN", "REHAU", "SALAMANDER", "WEISS PROFIL", "REYNAERS", "TRESPA"];
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    const section = page.locator('section[aria-label="Parteneri"]');
    await section.scrollIntoViewIfNeeded();
    const boxes = await section.locator("img").evaluateAll((imgs) =>
      imgs.map((img) => {
        const rect = img.getBoundingClientRect();
        return {
          alt: img.alt,
          src: img.getAttribute("src"),
          naturalWidth: img.naturalWidth,
          x: rect.x,
          y: rect.y,
          w: rect.width,
          h: rect.height,
        };
      }),
    );
    assert.deepEqual(
      boxes.map((box) => box.alt),
      names,
    );
    for (const box of boxes) {
      assert.ok(box.naturalWidth > 0, `${box.alt} did not load`);
      assert.match(box.src, /^\/media\/partners\//);
      assert.ok(box.h >= 36 && box.h <= 56, `${box.alt} height ${box.h}`);
      assert.ok(box.w > 24, `${box.alt} is too narrow`);
    }
    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const a = boxes[i];
        const b = boxes[j];
        const overlaps = a.x < b.x + b.w - 1 && a.x + a.w - 1 > b.x && a.y < b.y + b.h - 1 && a.y + a.h - 1 > b.y;
        assert.equal(overlaps, false, `${a.alt} overlaps ${b.alt}`);
      }
    }
    const label = await section.getByRole("heading", { name: "Parteneri" }).boundingBox();
    assert.ok(label);
    for (const box of boxes) {
      const overlaps =
        label.x < box.x + box.w - 1 &&
        label.x + label.width - 1 > box.x &&
        label.y < box.y + box.h - 1 &&
        label.y + label.height - 1 > box.y;
      assert.equal(overlaps, false, `Parteneri overlaps ${box.alt}`);
    }
    assertClean(monitors, "partners");
  } finally {
    await page.close();
  }
});

test("structured data describes the local business", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    const data = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('script[type="application/ld+json"]')];
      return nodes.map((node) => JSON.parse(node.textContent));
    });
    assert.equal(data.length, 1);
    const graph = data[0];
    assert.equal(graph["@context"], "https://schema.org");
    assert.equal(JSON.stringify(graph).includes("SearchAction"), false);
    const business = graph["@graph"].find((item) => item["@type"] === "HomeAndConstructionBusiness");
    const website = graph["@graph"].find((item) => item["@type"] === "WebSite");
    assert.equal(business.name, "Europlay Alco");
    assert.equal(business.legalName, "Europlay Alco SRL");
    assert.equal(business.url, "https://ferestretermopan.ro/");
    assert.equal(business.telephone, "+40731289684");
    assert.equal(business.email, "gigichircu@yahoo.com");
    assert.equal(business.taxID, "37899543");
    assert.equal(business.identifier.value, "J40/11304/2017");
    assert.equal(business.address.addressCountry, "RO");
    assert.equal(business.address.addressRegion, "Sector 3");
    assert.ok(business.geo.latitude > 44.3 && business.geo.latitude < 44.5);
    assert.ok(business.geo.longitude > 26.0 && business.geo.longitude < 26.3);
    assert.equal(business.sameAs[0], REVIEWS);
    assert.ok(business.knowsAbout.includes("Tâmplărie PVC"));
    assert.equal(business.alternateName, "ferestretermopan.ro");
    assert.equal(website.name, "ferestretermopan.ro");
    assert.equal(website.alternateName, "Europlay Alco");
    assert.equal(website.inLanguage, "ro-RO");
    assert.equal(website.publisher["@id"], business["@id"]);
    assertClean(monitors, "schema");
  } finally {
    await page.close();
  }
});

test("contact and local service pages have their own titles", { timeout: 30000 }, async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await page.goto(`${base}/contact`, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { level: 1 }).waitFor();
    assert.equal(await page.title(), "Contact Europlay Alco | Ferestre Termopan");
    assert.match(await page.locator("h1").innerText(), /Contact/);
    assert.match(await page.locator("body").innerText(), /Theodor Pallady/);

    await page.goto(`${base}/ferestre-termopan-bucuresti`, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { level: 1 }).waitFor();
    assert.equal(await page.title(), "Ferestre Termopan București | Montaj Europlay Alco");
    assert.match(await page.locator("h1").innerText(), /Ferestre termopan în București/);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    assert.match(description, /Europlay Alco SRL/);
    assert.doesNotMatch(description, /deviz în lei/i);
    assert.doesNotMatch(await page.locator("body").innerText(), /deviz în lei/i);
  } finally {
    await page.close();
  }
});

test("showroom lists the neighbourhoods and the phone", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    const section = page.locator("#contact");
    await section.scrollIntoViewIfNeeded();
    const heading = section.getByRole("heading", { name: "Showroom" });
    assert.ok((await heading.boundingBox())?.width > 80, "showroom heading is not visible");
    const text = await section.innerText();
    for (const place of ["Pallady", "Titan", "Dristor", "Balta Albă", "Vitan", "Rehau"]) {
      assert.match(text, new RegExp(place));
    }
    assert.match(text, /Theodor Pallady nr\. 37/);
    const phone = section.locator('a[href="tel:+40731289684"]');
    assert.match(await phone.innerText(), /0731 289 684/);
    const phoneBox = await phone.boundingBox();
    const textBox = await section.locator("p").first().boundingBox();
    assert.ok(phoneBox && textBox);
    const overlaps =
      textBox.y < phoneBox.y + phoneBox.height - 1 &&
      textBox.y + textBox.height - 1 > phoneBox.y &&
      textBox.x < phoneBox.x + phoneBox.width - 1 &&
      textBox.x + textBox.width - 1 > phoneBox.x;
    assert.equal(overlaps, false, "showroom text overlaps the phone");
    assertClean(monitors, "showroom");
  } finally {
    await page.close();
  }
});

test("the firm is dated 2017 and Rehau is a partner", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 390, height: 844 });
  try {
    const about = page.getByText("firmă înființată în 2017");
    await about.scrollIntoViewIfNeeded();
    assert.match(await about.innerText(), /Europlay Alco SRL, firmă înființată în 2017/);
    assert.doesNotMatch(await page.locator("body").innerText(), /De peste 25 de ani montăm/);
    assert.match(await page.locator("body").innerText(), /experiență de peste 25 de ani/);
    assert.doesNotMatch(await page.locator("body").innerText(), /deviz în lei/i);

    const rehau = page.locator('img[alt="REHAU"]');
    await rehau.scrollIntoViewIfNeeded();
    assert.equal(await rehau.evaluate((img) => img.complete && img.naturalWidth > 0), true);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    assert.equal(overflow, false, "mobile page scrolls sideways");

    const schema = await page.evaluate(() => {
      const node = document.querySelector('script[type="application/ld+json"]');
      return JSON.parse(node.textContent);
    });
    const business = schema["@graph"].find((item) => item["@type"] === "HomeAndConstructionBusiness");
    assert.ok(business.knowsAbout.includes("Rehau"));

    await page.goto(`${base}/legal`, { waitUntil: "domcontentloaded" });
    assert.doesNotMatch(await page.locator("body").innerText(), /deviz în lei/i);
    assertClean(monitors, "2017 and Rehau");
  } finally {
    await page.close();
  }
});

test("section titles use the Onest style from the old site", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    for (const name of [
      "Parteneri",
      "Servicii Europlay Alco",
      "Montaj termopane",
      "Încredere",
      "Întrebări",
      "Showroom",
    ]) {
      const heading = page.getByRole("heading", { name, exact: true });
      await heading.scrollIntoViewIfNeeded();
      const style = await heading.evaluate((el) => {
        const computed = getComputedStyle(el);
        return {
          font: computed.fontFamily,
          weight: computed.fontWeight,
          align: computed.textAlign,
          size: parseFloat(computed.fontSize),
          color: computed.color,
          stroke: computed.webkitTextStrokeWidth,
        };
      });
      assert.match(style.font, /Onest/, `${name} font is ${style.font}`);
      assert.equal(style.weight, "400", `${name} should not be bold`);
      assert.equal(style.align, "center", `${name} is not centered`);
      assert.equal(style.color, "rgba(0, 0, 0, 0)", `${name} should be transparent`);
      assert.ok(parseFloat(style.stroke) > 0, `${name} has no outline`);
      assert.ok(style.size >= 80, `${name} is only ${style.size}px`);
    }
    const trust = await page.getByRole("heading", { name: "Încredere" }).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const services = await page
      .getByRole("heading", { name: "Servicii Europlay Alco" })
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    assert.ok(trust > services, "Încredere should be larger, like the old site");
    assertClean(monitors, "heading style");
  } finally {
    await page.close();
  }
});

test("the trust photo slides up when it scrolls into view", { timeout: 30000 }, async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 700 } });
  const monitors = attachMonitors(page);
  try {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.locator("h1").waitFor();
    const photo = page.locator("img[alt='Gheorghe Chircu, Europlay Alco']");
    const before = await photo.evaluate((el) => {
      const style = getComputedStyle(el);
      return { opacity: style.opacity, translate: style.translate, name: style.animationName };
    });
    assert.equal(before.name, "trust-slide");
    assert.ok(Number(before.opacity) < 0.2, `photo starts too visible (${before.opacity})`);
    await page.evaluate(() => {
      const img = document.querySelector("img[alt='Gheorghe Chircu, Europlay Alco']");
      const top = img.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "instant" });
    });
    await page.waitForFunction(() => {
      const img = document.querySelector("img[alt='Gheorghe Chircu, Europlay Alco']");
      return img && Number(getComputedStyle(img).opacity) > 0.9;
    });
    assertClean(monitors, "trust slide");
  } finally {
    await page.close();
  }
});

test("site links open the right pages", { timeout: 30000 }, async () => {
  const { page, monitors } = await openPage({ width: 1280, height: 800 });
  try {
    const phones = await page.locator('a[href^="tel:"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
    assert.ok(phones.length >= 2 && phones.every((href) => href === "tel:+40731289684"), phones.join(","));

    const wiki = page.locator('a[href="https://ro.wikipedia.org/wiki/Termopan"]');
    await wiki.scrollIntoViewIfNeeded();
    assert.equal(await wiki.getAttribute("target"), "_blank");

    const mapLinks = page.locator(`a[href="${"https://www.google.com/maps/search/?api=1&query=Europlay+Alco+Theodor+Pallady+37+Bucuresti"}"]`);
    assert.ok((await mapLinks.count()) >= 2, "map links missing");
    assert.equal(await mapLinks.first().getAttribute("target"), "_blank");

    await page.getByRole("link", { name: "Confidențialitate" }).click();
    await page.waitForURL(/\/legal/);
    await page.locator("#confidentialitate").waitFor();
    await page.goto(`${base}/legal#termeni`, { waitUntil: "domcontentloaded" });
    await page.locator("#termeni").waitFor();
    await page.goto(`${base}/legal#cookie`, { waitUntil: "domcontentloaded" });
    await page.locator("#cookie").waitFor();

    await page.goto(`${base}/contact`, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.goto(`${base}/ferestre-termopan-bucuresti`, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { level: 1 }).waitFor();
    assertClean(monitors, "links pages");
  } finally {
    await page.close();
  }
});


