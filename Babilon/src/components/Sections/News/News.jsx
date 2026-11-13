import React, { useMemo, useState } from "react";
import "./News.css";

import kiotImg from "../../../assets/BlogImages/kiot.png";
import libraryImg from "../../../assets/BlogImages/wollo-library.png";
import titaImg from "../../../assets/BlogImages/wollo-tita.png";

/* Replace the sample content below with your real data / API response. */
const NEWS = [
  {
    id: 1,
    category: "Research",
    title:
      "Kombolcha Institute of Technology Opens New Engineering Research Lab for Regional Industry",
    excerpt:
      "The new facility brings students, faculty and local manufacturers together to work on practical projects in materials, energy and automation, with the first joint studies starting this semester.",
    university: "Kombolcha Institute of Technology",
    date: "2026-11-10",
    readTime: 4,
    image: kiotImg,
    href: "#",
  },
  {
    id: 2,
    category: "Campus",
    title:
      "Wollo University Library Extends Opening Hours and Launches Digital Catalogue",
    excerpt:
      "Students can now search, reserve and renew books online, and the reading halls stay open until late during exam weeks.",
    university: "Wollo University",
    date: "2026-11-07",
    readTime: 3,
    image: libraryImg,
    href: "#",
  },
  {
    id: 3,
    category: "Admissions",
    title:
      "Tita Campus Announces Orientation Programme for Newly Placed Students",
    excerpt:
      "New students will receive guidance on registration, dormitories, student services and academic support.",
    university: "Wollo University, Tita Campus",
    date: "2026-11-04",
    readTime: 3,
    image: titaImg,
    href: "#",
  },
  {
    id: 4,
    category: "Scholarships",
    title:
      "Applications Open for Merit Scholarships at Partner Universities in the Wollo Region",
    excerpt:
      "Eligible undergraduate and postgraduate applicants can submit documents through their university offices before the deadline.",
    university: "Wollo Info Hub",
    date: "2026-10-30",
    readTime: 2,
    image: null,
    href: "#",
  },
  {
    id: 5,
    category: "Admissions",
    title:
      "Registration Dates for the Second Semester Published by Regional Universities",
    excerpt:
      "Check the updated academic calendar for registration, add and drop periods, and the start of classes.",
    university: "Wollo Info Hub",
    date: "2026-10-27",
    readTime: 2,
    image: null,
    href: "#",
  },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

function ArrowIcon() {
  return (
    <svg
      className="news__arrow"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 11.5L11.5 4.5M5.5 4.5H11.5V10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Meta({ item }) {
  return (
    <p className="news__meta">
      <span className="news__university">{item.university}</span>
      <span className="news__meta-sep" aria-hidden="true" />
      <time dateTime={item.date}>{formatDate(item.date)}</time>
      <span className="news__meta-sep" aria-hidden="true" />
      <span>{item.readTime} min read</span>
    </p>
  );
}

function News() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(NEWS.map((n) => n.category)))],
    []
  );
  const [active, setActive] = useState("All");

  const items = active === "All" ? NEWS : NEWS.filter((n) => n.category === active);
  const [featured, ...rest] = items;

  return (
    <section className="news" aria-labelledby="news-heading">
      <div className="news__container">
        <header className="news__header">
          <div className="news__heading-group">
            <h2 id="news-heading" className="news__title">
              Latest from the universities
            </h2>
            <p className="news__subtitle">
              Admissions, research and campus updates from higher education
              institutions across the Wollo region.
            </p>
          </div>

          <div className="news__filters" role="tablist" aria-label="News categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active === cat}
                className={`news__filter ${active === cat ? "is-active" : ""}`}
                onClick={() => setActive(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {!featured ? (
          <p className="news__empty">No news in this category yet. Check back soon.</p>
        ) : (
          <div className="news__grid">
            <article className="news__featured">
              <a href={featured.href} className="news__featured-link">
                {featured.image ? (
                  <div className="news__featured-media">
                    <img src={featured.image} alt="" loading="lazy" />
                    <span className="news__chip">{featured.category}</span>
                  </div>
                ) : (
                  <span className="news__chip news__chip--inline">{featured.category}</span>
                )}
                <h3 className="news__featured-title">{featured.title}</h3>
                <p className="news__excerpt">{featured.excerpt}</p>
                <Meta item={featured} />
              </a>
            </article>

            <div className="news__side">
              <ul className="news__list">
                {rest.map((item) => (
                  <li key={item.id} className="news__item">
                    <a
                      href={item.href}
                      className={`news__item-link ${item.image ? "" : "news__item-link--text"}`}
                    >
                      {item.image && (
                        <div className="news__thumb">
                          <img src={item.image} alt="" loading="lazy" />
                        </div>
                      )}
                      <div className="news__item-body">
                        <span className="news__category">{item.category}</span>
                        <h3 className="news__item-title">{item.title}</h3>
                        <Meta item={item} />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>

              <a href="/news" className="news__more">
                View more news
                <ArrowIcon />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default News;