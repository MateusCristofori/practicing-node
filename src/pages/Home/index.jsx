import { LayoutComponents } from "../../components/LayoutComponents/index";

export const Home = () => {
  return (
    <LayoutComponents>
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">
            <span style={{ color: "#fff" }}>Notícias</span>
          </h1>
          <br />
          <br />
          <p style={{ color: "#f4f4f4" }} className="home-description">
            Blog de notícias.
          </p>
        </div>
      </div>
    </LayoutComponents>
  );
};
