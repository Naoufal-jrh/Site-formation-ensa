function CarteActiviteARendre({ data }) {
  const { travail, cours, delais, rendu } = data;
  return (
    <div className="border-b py-2 flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <h1 className="font-bold text-gray-700 text-md">{travail}</h1>
        {rendu ? <RenduFlag /> : <NonRenduFlag />}
      </div>
      <h2 className="text-sm">{cours}</h2>
      <div className="flex flex-row justify-between">
        <span className="text-gray-500 font-semibold">Dernier Délais :</span>
        <span className="text-muted-foreground">{delais}</span>
      </div>
    </div>
  );
}

function RenduFlag() {
  return <span className="text-green-400">Rendu</span>;
}
function NonRenduFlag() {
  return <span className="text-red-400">Non Rendu</span>;
}

export default CarteActiviteARendre;