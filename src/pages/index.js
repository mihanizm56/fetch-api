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
    title: <Translate>Easy to Use</Translate>,
    imageUrl: "img/like.svg",
    description: (
      <Translate>
        Fetch-API provides the same interface for all types of requests.
      </Translate>
    ),
  },
  {
    title: <Translate>Fetch on steroids</Translate>,
    imageUrl: "img/like.svg",
    description: (
      <Translate>All native window.fetch features are supported.</Translate>
    ),
  },
  {
    title: <Translate>Universal library</Translate>,
    imageUrl: "img/like.svg",
    description: (
      <Translate>
        For browser this is usual window.fetch and for Node.js node-fetch is
        used."
      </Translate>
    ),
  },
  {
    title: <Translate>All types of validations</Translate>,
    imageUrl: "img/like.svg",
    description: (
      <Translate>
        You can use shemas to validate responses or you can provide your own
        validate function"
      </Translate>
    ),
  },
  {
    title: <Translate>Translate your responses</Translate>,
    imageUrl: "img/like.svg",
    description: (
      <Translate>
        Just provide translateFunction option that handles the response key and
        translate it"
      </Translate>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      <div className="text--center">
        <img className={styles.featureImage} src={imgUrl} alt={title} />
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx("hero hero--dark", styles.heroBanner)}>
        <div className="container">
          <h1 className={clsx(styles["hero__title"])}>{siteConfig.title}</h1>
          <p className="hero__subtitle">
            <Translate>
              Api client based of native fetch api with a lot of features
            </Translate>
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--primary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("/docs/overview")}
            >
              <Translate>Get Started</Translate>
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
