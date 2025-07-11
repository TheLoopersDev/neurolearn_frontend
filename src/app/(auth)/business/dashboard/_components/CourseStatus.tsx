const ProgressBar = ({
  label,
  percentage,
  colorClass,
}: {
  label: string;
  percentage: number;
  colorClass: string;
}) => (
  <div>
    <div className="flex justify-between text-sm">
      <span className="font-semibold text-foreground">{label}</span>
      <span className="text-gray-500">{percentage}%</span>
    </div>
    <div className="mt-1 h-2 rounded-full bg-secondary">
      <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

export default function CourseStatus() {
  return (
    <div className="rounded-xl bg-background p-6 shadow-sm">
      <h2 className="text-lg font-bold text-foreground">Course Status</h2>

      <div className="relative my-6 flex h-48 w-48 items-center justify-center mx-auto">
        {/* Conic gradient for the chart */}
        <div
          className="absolute h-full w-full rounded-full"
          style={{
            background: `conic-gradient(
              #2563eb 0% 55%,       /* Completed: blue-700 */
              #34d399 55% 90%,    /* Learning: green-400 */
              #f97316 90% 100%     /* Pending: orange-500 */
            )`,
          }}
        ></div>
        {/* Inner circle to create the donut shape */}
        <div className="absolute h-36 w-36 rounded-full bg-background"></div>
        {/* Center text */}
        <div className="relative text-center">
          <span className="text-4xl font-bold text-foreground">100%</span>
        </div>
      </div>

      <div className="space-y-4">
        <ProgressBar label="Completed" percentage={55} colorClass="bg-blue-700" />
        <ProgressBar label="Learning" percentage={35} colorClass="bg-emerald-400" />
        <ProgressBar label="Pending" percentage={5} colorClass="bg-orange-500" />
      </div>
    </div>
  );
}
