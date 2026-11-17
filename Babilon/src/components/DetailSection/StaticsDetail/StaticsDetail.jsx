import React from 'react'
import { Link } from 'react-router-dom'
import styles from './StaticsDetail.module.css'

const LOGO_ICON =
  'https://cdn.prod.website-files.com/6720dd1ab6df0da205830ab1/6870f623cf3df417ce45df05_icon%20logo%20eternacloud.png'

const PILLARS = [
  {
    label: 'Top 10 in East Africa',
    items: ['2007', '2015', '2025', '#Top 10'],
    leftVw: 2.8,
    bottomVw: 7,
  },
  {
    label: 'All-Time Graduates',
    items: ['Start', '2014', '2020', 'Today: 280K+'],
    leftVw: 22.4,
    bottomVw: 9.08,
  },
  {
    label: 'WOU Alumni',
    items: [
      'Notable alumni',
      'Leaders in every sector',
      'Across all fields',
      { text: 'View List ↗', to: '/alumni' },
    ],
    leftVw: 41.2,
    bottomVw: 11.16,
  },
  {
    label: 'Research Leaders',
    items: ['12K+ since 2014', '12,293 outputs', 'Research groups', 'Publications'],
    leftVw: 61.1,
    bottomVw: 13.24,
  },
]

function renderItem(item) {
  if (typeof item === 'string') return item
  return (
    <Link to={item.to} className={styles.itemLink}>
      {item.text}
    </Link>
  )
}

function itemKey(item) {
  return typeof item === 'string' ? item : item.text
}

function StaticsDetail() {
  return (
    <section className={styles.section}>
      {/* Block 1 — Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <svg
            width="19"
            height="18"
            viewBox="0 0 17 16"
            fill="none"
            className={styles.badgeIcon}
          >
            <g clipPath="url(#prec-clip)">
              <circle cx="8.5" cy="8" r="7" stroke="#c86fff" fill="none" />
              <path d="M9.5 11.5V10.5H7.5V11.5H9.5ZM7.5 14.5C7.5 15.0523 7.94772 15.5 8.5 15.5C9.05228 15.5 9.5 15.0523 9.5 14.5H7.5ZM8.5 11.5H7.5V14.5H8.5H9.5V11.5H8.5Z" fill="rgb(200, 111, 255)" />
              <path d="M12 7H11V9H12V7ZM15 9C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7V9ZM12 8V9H15V8V7L12 7V8Z" fill="rgb(200, 111, 255)" />
              <path d="M5 9H6V7H5V9ZM2 7C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9V7ZM5 8V7H2V8V9H5V8Z" fill="rgb(200, 111, 255)" />
              <path d="M7.5 4.5V5.5H9.5V4.5H7.5ZM9.5 1.5C9.5 0.947715 9.05228 0.5 8.5 0.5C7.94772 0.5 7.5 0.947715 7.5 1.5H9.5ZM8.5 4.5H9.5V1.5H8.5H7.5V4.5H8.5Z" fill="rgb(200, 111, 255)" />
            </g>
            <defs>
              <clipPath id="prec-clip">
                <rect width="16" height="16" fill="white" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
          Top 10 in East Africa
        </div>

        <div className={styles.headingWrap}>
          <h2 className={styles.title}>
            <span className={`${styles.titleLine} ${styles.titleLineOne}`}>
              Our graduates lead across every sector.
            </span>
            <span className={`${styles.titleLine} ${styles.titleLineGradient}`}>
              Research that keeps growing.
            </span>
          </h2>
          <p className={styles.subtext}>
            More than 280K+ graduates and 12,293 scholarly outputs since 2014, and counting.
          </p>
        </div>
      </div>

      {/* Block 2 — Pillars */}
      <div className={styles.pillars}>
        {/* Desktop staircase */}
        <div className={styles.desktop}>
          {PILLARS.map((pillar) => (
            <div
              key={pillar.label}
              className={styles.dPillar}
              style={{
                bottom: `${pillar.bottomVw}vw`,
                left: `${pillar.leftVw}vw`,
              }}
            >
              <div className={styles.dChip}>
                <img src={LOGO_ICON} alt="" className={styles.dChipImg} />
                {pillar.label}
              </div>

              <div className={styles.dLineWrap}>
                <div className={styles.dItems}>
                  {pillar.items.map((item) => (
                    <div key={itemKey(item)} className={styles.dItem}>
                      {renderItem(item)}
                    </div>
                  ))}
                </div>
                <div className={styles.dLine} />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile alternating flow */}
        <div className={styles.mobile}>
          {PILLARS.map((pillar, index) => {
            const isRight = index % 2 !== 0
            return (
              <div
                key={pillar.label}
                className={`${styles.mPillar} ${isRight ? styles.mPillarRight : ''}`}
              >
                <div className={styles.mChip}>
                  <img src={LOGO_ICON} alt="" className={styles.mChipImg} />
                  {pillar.label}
                </div>

                <div className={styles.mRow}>
                  <div className={styles.mLine} />
                  <div className={styles.mItems}>
                    {pillar.items.map((item) => (
                      <div key={itemKey(item)} className={styles.mItem}>
                        {renderItem(item)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default StaticsDetail