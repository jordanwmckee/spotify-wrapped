import "./TopCard.css";

const TopCard = ({ list, title }) => {
  return (
    <div className="top-card">
      <div className="top-card-title">
        <h2>{title}</h2>
      </div>
      <div className="top-card-list">
        {list.map((data) => (
          <ul className="top-list-item" key={data.name}>
            <li key={data.name}>
              <img
                src={data.image}
                width="100px"
                height="100px"
                alt="unavailable."
              />
              <h3>{data.name}</h3>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default TopCard;
