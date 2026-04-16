import React from 'react'
import { X, DollarSign, Building2, Shuffle, GraduationCap, Calendar, Banknote, ClipboardList } from 'lucide-react'

const INFO_ITEMS = [
  {
    icon: DollarSign,
    title: 'Funding Amounts',
    text: 'Approximately $10,474 per year per student for participating private schools. Up to $30,000 per year for students with a qualifying IEP. $2,000 per year for homeschool (not covered by this tool).',
  },
  {
    icon: Building2,
    title: 'Who Runs It',
    text: 'Administered by the Texas Comptroller of Public Accounts, via Odyssey, the certified Educational Assistance Organization (CEAO).',
  },
  {
    icon: Shuffle,
    title: 'Lottery System',
    text: 'Demand exceeded available funding. Families applied Feb 4 through March 31, 2026, and are now awaiting lottery results in April.',
  },
  {
    icon: GraduationCap,
    title: 'School Eligibility',
    text: 'Participating schools must be TEPSAC- or TEA-accredited, have operated for at least 2 years, and administer a nationally norm-referenced assessment.',
  },
  {
    icon: Calendar,
    title: 'Key Dates',
    text: 'Lottery results: Early April 2026. School selection deadline: June 1, 2026. Schools confirm enrollment: June 15, 2026.',
  },
  {
    icon: Banknote,
    title: 'Fund Disbursement',
    text: 'July 1 (25%), October 1 (50%), April 1 (remaining 25%). Parents must confirm school selection by June 1.',
  },
  {
    icon: ClipboardList,
    title: 'Waitlist',
    text: 'The program is expected to run out of funding in year one. A waitlist exists for applicants not selected in the lottery.',
  },
]

export default function TEFAInfoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl custom-scrollbar">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-display text-2xl font-bold text-charcoal">How TEFA Works</h2>
            <button onClick={onClose} className="text-charcoal-light hover:text-charcoal p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-charcoal-light mb-5">
            The <strong>Texas Education Freedom Accounts (TEFA)</strong> program was created by Senate Bill 2, signed into law May 3, 2025,
            and launches for the 2026 to 2027 school year. Here is what you need to know:
          </p>

          <div className="space-y-4">
            {INFO_ITEMS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-cream-dark flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-burnt" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-charcoal">{title}</h4>
                  <p className="text-xs text-charcoal-light mt-0.5 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
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
