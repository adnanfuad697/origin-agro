'use client'

const divisions = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh']

interface AddressFieldsProps {
  division: string
  setDivision: (v: string) => void
  district: string
  setDistrict: (v: string) => void
  upazila: string
  setUpazila: (v: string) => void
  villageOrArea: string
  setVillageOrArea: (v: string) => void
  googleMapsLink: string
  setGoogleMapsLink: (v: string) => void
}

export default function AddressFields({
  division, setDivision,
  district, setDistrict,
  upazila, setUpazila,
  villageOrArea, setVillageOrArea,
  googleMapsLink, setGoogleMapsLink,
}: AddressFieldsProps) {
  const hasMapsLink = googleMapsLink.trim().length > 0

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">Google Maps Location Link (Optional)</label>
        <input type="url" value={googleMapsLink} onChange={(e) => setGoogleMapsLink(e.target.value)} placeholder="Paste your Google Maps link here" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
        <p className="text-[11px] text-gray-400 mt-1">If you provide this, the address boxes below become optional.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Division {!hasMapsLink && '*'}</label>
          <select value={division} onChange={(e) => setDivision(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm bg-white">
            <option value="">Select</option>
            {divisions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">District {!hasMapsLink && '*'}</label>
          <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Gazipur" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Upazila / Thana {!hasMapsLink && '*'}</label>
          <input type="text" value={upazila} onChange={(e) => setUpazila(e.target.value)} placeholder="e.g. Mirzapur" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Village / Area (Optional)</label>
          <input type="text" value={villageOrArea} onChange={(e) => setVillageOrArea(e.target.value)} placeholder="e.g. Sonargaon" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#0A5C36] focus:outline-none text-sm" />
        </div>
      </div>
    </div>
  )
}
