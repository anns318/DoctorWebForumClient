async function PostAPI(url, formData) {
  const req = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const status = req.status;
  const data = await req.json();

  return { status, data };
}
async function GetAPI(url) {
  const req = await fetch(url);
  const res = await req.json();

  return res;
}
async function GetAPI(url, formData) {
  const req = await fetch(url, {
    body: JSON.stringify(formData),
  });
  const res = await req.json();

  return res;
}
