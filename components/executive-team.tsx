import Image from 'next/image'

function LinkedinIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const team = [
  {
    name: 'Engr. Md. Rafiqul Islam',
    designation: 'Founder & Chief Executive Officer',
    image: '/images/ceo-portrait.png',
    bio: 'A visionary agro-entrepreneur with 15+ years of experience in sustainable agriculture and resort development. Holds a B.Sc. in Agricultural Engineering from BAU. Former director at Bangladesh Agro Industries Corporation, now leading the Origin Agro vision.',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Md. Shahadat Hossain',
    designation: 'Co-Founder & Chief Operations Officer',
    image: '/images/coo-portrait.png',
    bio: 'Expert in Shariah-compliant finance and agro-investment structuring with 12+ years in the sector. MBA from IBA, University of Dhaka. Architected the Shariah-Based Profit Distribution Model that underpins Origin Agro\'s investor framework.',
    linkedin: '#',
    twitter: '#',
  },
]

export default function ExecutiveTeam() {
  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[#F26522] font-semibold text-sm uppercase tracking-widest mb-2">Leadership</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Meet Our Executive Team</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
            Driven by passion for sustainable agriculture and Shariah-compliant investment, our leadership
            team brings decades of combined expertise.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-[#F7F4EE] rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
            >
              {/* Portrait */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#0A5C36] shadow-lg mb-5 group-hover:border-[#F26522] transition-colors duration-300">
                <Image
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <h3 className="text-xl font-extrabold text-gray-900">{member.name}</h3>
              <p className="text-[#0A5C36] font-semibold text-sm mt-1">{member.designation}</p>

              <div className="w-10 h-0.5 bg-[#F26522] rounded-full my-4" />

              <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-6">
                <a
                  href={member.linkedin}
                  className="w-9 h-9 bg-[#0A5C36] text-white rounded-full flex items-center justify-center hover:bg-[#F26522] transition-colors"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <LinkedinIcon />
                </a>
                <a
                  href={member.twitter}
                  className="w-9 h-9 bg-[#0A5C36] text-white rounded-full flex items-center justify-center hover:bg-[#F26522] transition-colors"
                  aria-label={`${member.name} X (Twitter)`}
                >
                  <XIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
