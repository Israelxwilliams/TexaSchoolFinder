import React from 'react'

export default function TEFAInfoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl custom-scrollbar">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-display text-2xl text-charcoal">How TEFA Works</h2>
            <button onClick={onClose} className="text-charcoal-light hover:text-charcoal text-2xl leading-none">&times;</button>
          </div>

          <p className="text-sm text-charcoal-light mb-5">
            The <strong>Texas Education Freedom Accounts (TEFA)</strong> program was created by Senate Bill 2, signed into law May 3, 2025,
            and launches for the 2026–27 school year. Here's what you need to know:
          </p>

          <div className="space-y-4">
            <InfoItem
              icon="&#128176;"
              title="Funding Amounts"
              text="~$10,474/year per student for participating private schools. Up to $30,000/year for students with a qualifying IEP. $2,000/year for homeschool (not covered by this app)."
            />
            <InfoItem
              icon="&#127979;"
              title="Who Runs It"
              text="Administered by the Texas Comptroller of Public Accounts, via Odyssey — the certified Educational Assistance Organization (CEAO)."
            />
            <InfoItem
              icon="&#127922;"
              title="Lottery System"
              text="Demand exceeded available funding. Families applied Feb 4 – March 31, 2026 and are now awaiting lottery results in April."
            />
            <InfoItem
              icon="&#127891;"
              title="School Eligibility"
              text="Participating schools must be TEPSAC- or TEA-accredited, have operated for at least 2 years, and administer a nationally norm-referenced assessment."
            />
            <InfoItem
              icon="&#128197;"
              title="Key Dates"
              text="Lottery results: Early April 2026. School selection deadline: June 1, 2026. Schools confirm enrollment: June 15, 2026."
            />
            <InfoItem
              icon="&#128181;"
              title="Fund Disbursement"
              text="July 1 (25%), October 1 (50%), April 1 (remaining 25%). Parents must confirm school selection by June 1."
            />
            <InfoItem
              icon="&#128203;"
              title="Waitlist"
              text="The program is expected to run out of funding in year one. A waitlist exists for applicants not selected in the lottery."
            />
          </div>

          <div className="mt-6 bg-cream-dark rounded-xl p-4 text-center">
            <p className="text-xs text-charcoal-light">
              Program facts sourced from the Texas Comptroller TEFA official site, Texas Tribune, and the official TEFA Parent Application Guide.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon, title, text }) {
  return (
    <div className="flex gap-3">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div>
        <h4 className="font-semibold text-sm text-charcoal">{title}</h4>
        <p className="text-xs text-charcoal-light mt-0.5 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
