import { PieChart, Pie, ResponsiveContainer } from "recharts";
import "./FloatingCard.css";

const FloatingCard = ({ data, title }) => {
  return (
    <div className="floating-card">
      <div className="floating-card-title">
        <h1>{title}</h1>
      </div>
      <div className="floating-card-graph">
        <PieChart width={1000} height={250}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#1db954"
          />
        </PieChart>
      </div>
      <div className="floating-card-data-table">
        <table className="table">
          <tr>
            <th>Name</th>
            <th>percentage %</th>
          </tr>
          {data.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.name}</td>
                <td>{val.percent}%</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default FloatingCard;
