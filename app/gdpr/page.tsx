export const metadata = { title: "GDPR & Soukromí — Drilex" };

export default function GdprPage() {
  return (
    <main className="min-h-screen bg-[#0b0b12] text-[#e6e6f0] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-xs font-mono text-[#7c3aed] hover:underline">
          ← zpět na drilex.cz
        </a>
        <h1 className="text-3xl font-bold mt-6 mb-2">Ochrana soukromí &amp; GDPR</h1>
        <p className="text-[#a0a0b8] mb-10 text-sm">
          Co o vás sbíráme a jak s tím nakládáme.
        </p>

        <section className="space-y-7 text-sm leading-relaxed text-[#c8c8da]">
          <div>
            <h2 className="text-lg font-semibold text-[#e6e6f0] mb-2">Co sbíráme</h2>
            <p>
              Používáme <strong>vlastní self-hosted analytiku</strong> (Matomo a Open Web
              Analytics) ke zlepšování obsahu. Sbíráme anonymní údaje:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>zobrazené stránky a čas strávený na webu,</li>
              <li>kliknutí a pohyb po stránce (heatmapy),</li>
              <li>odkud jste přišli (zdroj návštěvy),</li>
              <li>typ zařízení, prohlížeče a přibližná lokalita (z anonymizované IP).</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#e6e6f0] mb-2">Kde jsou data uložena</h2>
            <p>
              Veškerá data běží na <strong>našich vlastních serverech</strong> (matomo.drilex.cz
              a owa.drilex.cz). <strong>Nesdílíme je s žádnou třetí stranou</strong> a nepoužíváme
              reklamní sítě. IP adresa je anonymizovaná.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#e6e6f0] mb-2">Cookies a souhlas</h2>
            <p>
              Analytické cookies se načtou <strong>až po vašem souhlasu</strong>. Bez souhlasu se
              nic netrackuje — ukládáme pouze vaši volbu souhlasu.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#e6e6f0] mb-2">Vaše práva</h2>
            <p>
              Souhlas můžete kdykoli odvolat smazáním cookies prohlížeče. Máte právo na přístup k
              údajům, jejich opravu i výmaz. Napište nám na{" "}
              <a href="mailto:contact@drilex.cz" className="text-[#7c3aed] underline">
                contact@drilex.cz
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}