import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { Card, Title, DonutChart } from "@tremor/react";
import { schemeCategory10 } from 'd3-scale-chromatic';
import styles from './FloatingCard.module.css';

interface DataProps {
  name: string;
  count: number;
}

interface FloatingCardProps {
  data: DataProps[];
  title: string;
}

const FloatingCard = (props: FloatingCardProps) => {
  const { data, title } = props;
  return (
    <div className={styles.floatingCard}>
      <div className={styles.floatingCardTitle}>
        <h2>{title}</h2>
      </div>
      <div className={styles.floatingCardGraph}>  
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={60}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (value > 5) ? (
                  <text
                    x={x}
                    y={y}
                    fill={schemeCategory10[index % schemeCategory10.length]}
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {data[index].name}
                  </text>
                ) : null;
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={schemeCategory10[index % schemeCategory10.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.floatingCardDataTable}>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Count</th>
            </tr>
            {data.map((val: DataProps, key: number) => {
              return (
                <tr key={key}>
                  <td>{val.name}</td>
                  <td>{val.count}</td>
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
