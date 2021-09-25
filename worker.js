addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  let langs = await Storage.get("articleLang");

  return new Response(langs, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400"
    }
  });
}

//================定时任务===================
// Cron: 0 0 * * *

addEventListener('scheduled', event => {
  event.waitUntil(
    handleSchedule(event.scheduledTime)
  )
})

async function handleSchedule(scheduledDate) {

  let response = await fetch(`https://www.conchbrain.club/articles/config.json?${Math.random()}`);
  let pages = (await response.json()).pages;

  let langs = new Array();

  for(let i = 0; i < 40; i++) {
    let projects = await fetch(`https://www.conchbrain.club/articles/pages/${pages[i].name}?${Math.random()}`);
    projects = await projects.json();

    for(let j = 0; j < projects.length; j++) {

      let lang = projects[j].language;

      if(langs.indexOf(lang) < 0) {
        langs.push(lang);
      }
    }
  }

  await Storage.put("articleLang", JSON.stringify(langs));
}
