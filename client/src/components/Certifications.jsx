import { useEffect, useState } from 'react';
import { FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import { SectionHeading } from './SectionHeading.jsx';
import { Reveal } from './Reveal.jsx';
import { GlowCard } from './GlowCard.jsx';
import { certificationService } from '../services/certificationService.js';

// These 3 are always shown (their images live in /public/certificates).
const STATIC_CERTIFICATES = [
  {
    id: 'static-diploma',
    title: 'Diploma in Information Technology',
    issuer: 'Argus Academy, Ranchi',
    subtitle: '2024 · Grade: A+',
    status: 'Earned',
    image: '/certificates/Diploma_Information_Technology_Argus_Academy.jpeg',
  },
  {
    id: 'static-mern',
    title: 'MERN Full Stack Development',
    issuer: 'Briztech Infosystems Pvt. Ltd., Ranchi',
    subtitle: '2025 · Grade: A+',
    status: 'Earned',
    image: '/certificates/MERN_Full_Stack_Briztech.jpeg',
  },
  {
    id: 'static-hack-horizon',
    title: 'Hack Horizon 2.0',
    issuer: 'ARKA JAIN University, Jharkhand',
    subtitle: 'April 2026 · Certificate of Participation',
    status: 'Earned',
    image: '/certificates/Hack_Horizon_2_Certificate.jpeg',
  },
];

const BADGE_STYLES = {
  Earned: 'border-success/40 bg-success/10 text-success',
  'In Progress': 'border-accent/40 bg-accent/10 text-accent',
  Planned: 'border-white/15 bg-white/5 text-muted',
};

// Turn a certificate saved from the admin panel into the same shape as the static ones.
function fromDatabase(cert) {
  const date = cert.issueDate
    ? new Date(cert.issueDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '';
  return {
    id: cert._id,
    title: cert.title,
    issuer: cert.issuer,
    subtitle: date,
    status: cert.status || 'Planned',
    image: cert.image,
    link: cert.credentialUrl || cert.image,
  };
}

export default function Certifications() {
  const [dbCertificates, setDbCertificates] = useState([]);

  useEffect(() => {
    certificationService
      .getAll()
      .then((data) => setDbCertificates(Array.isArray(data) ? data.map(fromDatabase) : []))
      .catch(() => setDbCertificates([])); // backend down → still show the static cards
  }, []);

  // Skip database items that have the same title as a static card (avoids duplicates).
  const staticTitles = new Set(STATIC_CERTIFICATES.map((c) => c.title.toLowerCase()));
  const certificates = [
    ...STATIC_CERTIFICATES.map((c) => ({ ...c, link: c.image })),
    ...dbCertificates.filter((c) => !staticTitles.has(c.title.toLowerCase())),
  ];

  return (
    <section id="certifications">
      <SectionHeading
        eyebrow="Credentials"
        title="Certifications & Achievements"
        description="Technical certifications, training, and hackathon participation."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <Reveal key={cert.id} delay={(i % 3) * 0.08}>
            <GlowCard
              className={`h-full overflow-hidden ${cert.status === 'Planned' ? 'border-dashed' : ''}`}
              hover
            >
              {/* Certificate Image (or a simple placeholder if there is none) */}
              <div className="bg-black/20 p-3">
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate`}
                    className="h-56 w-full rounded-lg object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center rounded-lg border border-white/5">
                    <FaAward className="text-6xl text-accent/30" />
                  </div>
                )}
              </div>

              {/* Certificate Details */}
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <FaAward className="text-2xl text-accent" />
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                      BADGE_STYLES[cert.status] || BADGE_STYLES.Planned
                    }`}
                  >
                    {cert.status}
                  </span>
                </div>

                <h3 className="font-display text-base font-semibold text-white">{cert.title}</h3>

                {cert.issuer && (
                  <p className="mt-2 font-mono text-xs leading-relaxed text-muted">{cert.issuer}</p>
                )}

                {cert.subtitle && (
                  <p className="mt-2 font-mono text-xs text-muted">{cert.subtitle}</p>
                )}

                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
                  >
                    View Certificate
                    <FaExternalLinkAlt size={10} />
                  </a>
                )}
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
