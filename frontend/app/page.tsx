async function getData() {
  const res = await fetch('http://localhost:8000');
  return res.json();
}

export default async function Home() {
  const data = await getData();

  return (
    <div>
      <h1>Running Dashboard</h1>
      <p>{data.message}</p>
    </div>
  );
}
