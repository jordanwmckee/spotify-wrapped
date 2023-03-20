import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SET_PLAYER_URIS } from "context/user";
import PlayButton from "assets/images/play-button.png";
import "./TopCard.css";

const TopCard = (props: TopCardProps) => {
  const { list, title } = props;
  const [uri, setUri] = useState<string>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!uri) return;
    dispatch(SET_PLAYER_URIS([uri]));
  }, [uri]);

  return (
    <div className="top-card">
      <div className="top-card-title">
        <h2>{title}</h2>
      </div>
      <div className="top-card-list">
        {list.map((data) => (
          <ul className="top-list-item" key={data.name}>
            <li>
              {!data.uri ? (
                <img src={data.image} alt="unavailable." />
              ) : (
                <div className="top-list-pic">
                  <div
                    className="album-image"
                    onClick={() => {
                      setUri(data.uri);
                    }}
                  >
                    <img src={data.image} alt="unavailable" />
                    <div className="img-button">
                      <img src={PlayButton} alt="" />
                    </div>
                  </div>
                </div>
              )}
              <h3>{data.name}</h3>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default TopCard;
