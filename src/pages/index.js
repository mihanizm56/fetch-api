import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import Translate, { translate } from "@docusaurus/Translate";

const features = [
  {
    title: "Easy to Use",
    imageUrl: "img/like.svg",
    description: (
      <Translation>
        Fetch-API provides the same interface for all types of requests.
      </Translation>
    ),
  },
  {
    title: "Fetch on steroids",
    imageUrl: "img/like.svg",
    description: (
      <Translation>All native window.fetch features are supported.</Translation>
    ),
  },
  {
    title: "Universal library",
    imageUrl: "img/like.svg",
    description: (
      <Translation>
        For browser this is usual window.fetch and for Node.js node-fetch is
        used.
      </Translation>
    ),
  },
  {
    title: "All types of validations",
    imageUrl: "img/like.svg",
    description: (
      <Translation>
        You can use shemas to validate responses or you can provide your own
        validate function
      </Translation>
    ),
  },
  {
    title: "Select the fields that are necessary",
    imageUrl: "img/like.svg",
    description: (
      <Translation>
        You're able to select only necessary data from JSON response
      </Translation>
    ),
  },
  {
    title: "Translate your responses",
    imageUrl: "img/like.svg",
    description: (
      <Translation>
        Just provide translateFunction option that handles the response key and
        translate it
      </Translation>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--dark", styles.heroBanner)}>
        <div className="container">
          <h1 className={clsx(styles["hero__title"])}>{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--primary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("/docs/overview")}
            >
              <Translation>Get Started</Translation>
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
