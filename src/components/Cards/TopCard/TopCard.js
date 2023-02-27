import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_PLAYER_URIS } from "../../../context/user";
import "./TopCard.css";

const TopCard = ({ list, title }) => {
  const [uri, setUri] = useState(null);
  const { playerUris } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!uri) return;
    dispatch(SET_PLAYER_URIS([uri, ...playerUris]));
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
                      <img
                        src={require("../../../assets/images/play-button.png")}
                        alt=""
                      />
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
