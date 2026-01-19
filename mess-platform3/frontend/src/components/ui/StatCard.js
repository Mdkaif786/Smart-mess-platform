import GlassBox from "../ui/GlassBox";
function StatCard({ title, value }) {
    return (
      <GlassBox className="text-center">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-3xl mt-2">{value}</p>
      </GlassBox>
    );
  }
  
  export default StatCard;
  