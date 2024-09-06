const express = require("express");
const app = express();
const Parser = require('rss-parser');
const RSS = require('rss');

app.get("/", (req, res) => {
  const parser = new Parser();
  (async () => {
    const feed = await parser.parseURL('https://chromereleases.googleblog.com/feeds/posts/default?alt=rss');
    const filteredFeed = new RSS({
      title: feed.title,
      feed_url: "https://chrome-security-rss.glitch.me/",
      site_url: feed.link,
    });
    for (const item of feed.items) {
      if (item.title === 'Stable Channel Update for Desktop' || item.title === 'Extended Stable Channel Update for Desktop') {
        filteredFeed.item({
          title: item.title,
          url: item.link,
          description: item.content,
          author: item.author,
          guid: item.id,
          date: item.pubDate,
        })
      }
    }
    res.set('Content-Type', 'text/xml; charset=UTF-8');
    res.end(filteredFeed.xml())
  })()
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
