import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import "./FloatingCard.css";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


function renderTable(data){
return(
  <div className="table">
    <table>
      <tr>
        <th>Name</th>
        <th>percentage %</th>
      </tr>
      {data.map((val, key) =>{
        <tr key={key}>
          <td>{val.name}</td>
          <td>{val.percent}</td>
        </tr>
      })}
    </table>
  </div>
  );
};

const FloatingCard =({data, title}) =>{
  
  let state = {
    activeIndex: 0,
  };
  
   let onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };
  

  return(
    <div className="floating-card">
      <div className="floating-card-title">
        <h1>{title}</h1>
      </div>
      <div className="floating-card-graph">
        <PieChart width={1000} height={250}>
        <Pie data={data} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#1db954" />
        </PieChart>
        </div>
      <div className="floating-card-data-table">
      <table className="table">
      <tr>
        <th>Name</th>
        <th>percentage %</th>
      </tr>
      {data.map((val, key) =>{
        return(
        <tr key={key}>
          <td>{val.name}</td>
          <td>{val.percent}%</td>
        </tr>
        )
      })}
    </table>
      </div>
    </div>
  );
};

export default FloatingCard;