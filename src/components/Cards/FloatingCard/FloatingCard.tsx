import { PieChart, Pie, ResponsiveContainer } from "recharts";
import "./FloatingCard.css";

const FloatingCard = (props: { data: any; title: any }) => {
  const { data, title } = props;
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
          <tbody>
            <tr>
              <th>Name</th>
              <th>percentage %</th>
            </tr>
            {data.map((val: { name: string; percent: any }, key: any) => {
              return (
                <tr key={key}>
                  <td>{val.name}</td>
                  <td>{val.percent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FloatingCard;
