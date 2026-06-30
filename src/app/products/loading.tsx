export default function ProductsLoading() {
  return (
    <main className="products-page products-catalogue" aria-busy="true">
      <section className="products-catalogue__hero">
        <div className="site-shell">
          <div className="catalogue-loading__hero">
            <span className="catalogue-skeleton catalogue-skeleton--kicker" />
            <span className="catalogue-skeleton catalogue-skeleton--title" />
            <span className="catalogue-skeleton catalogue-skeleton--copy" />
          </div>
        </div>
      </section>
      <section className="catalogue-section">
        <div className="site-shell">
          <span className="catalogue-skeleton catalogue-skeleton--section-title" />
          <div className="catalogue-loading__grid">
            {Array.from({ length: 8 }, (_, index) => (
              <span
                key={index}
                className="catalogue-skeleton catalogue-skeleton--card"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
