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
  const status = req.status;

  if (status === 404) {
    return status;
  }

  const res = await req.json();
  return res;
}

// async function GetAPI(url, formData) {
//   const req = await fetch(url, {
//     body: JSON.stringify(formData),
//   });
//   const res = await req.json();

//   return res;
// }

async function PutAPI(url, formData) {
  const req = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: formData,
  });

  const status = req.status;

  return status;
}

function calculateTimeDiff(timeDifference) {
  if (timeDifference < 60000) {
    const secondsAgo = Math.floor(timeDifference / 1000);
    return `${secondsAgo} second${secondsAgo !== 1 ? "s" : ""} ago`;
  } else if (timeDifference < 3600000) {
    const minutesAgo = Math.floor(timeDifference / 60000);
    return `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
  } else if (timeDifference < 86400000) {
    const hoursAgo = Math.floor(timeDifference / 3600000);
    return `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
  } else {
    const daysAgo = Math.floor(timeDifference / 86400000);
    return `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
  }
}
