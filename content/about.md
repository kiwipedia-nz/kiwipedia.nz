+++
title = "About Kiwipedia"
draft = false
date = "2016-11-30T21:56:47+13:00"

+++

So you might wonder why I came up with yet another website about travel in New Zealand?

<!--more-->

The reason is simple - I believe there should be site which allows people to cooperate on it's content and offer it's data back to community so we can all benefit from it.

So far there are some set's off NZ data released on internet like [topomaps tiles from LINZ](https://data.linz.govt.nz/layer/767-nz-topo50-maps/), [NZ DOC tracks on Koordinates](https://koordinates.com/layer/753-doc-tracks/) and possibly more. And there are already great sites using this data to make access to them more user friendly, for example [NZ Topo Map](http://www.topomap.co.nz/) or [NZ Walks Information](http://nzwalksinfo.co.nz/). However, all this data are still separated and lack and option to combine them together.

This is when the Kiwipedia would like to help. We are going to import and re-use different sets of data, combine them together and create some usefull tools for travellers and hikers. And we will try to open as much of our data to public so you can have a play and create some awesome things with them too. Our current site and services already supports creating and joining walking tracks together, calculating distances and elevations and have some support for adding pictures too. You can have a look at [Fairy Falls and Goodfellow]({{< relref "track/auckland/fairy-falls-and-goodfellow-track-loop.md" >}}) track as a sample - it's a composite track from half of Fair Falls trek, whole Goodfellow Track and half of the Old Coach Road track.track/auckland/fairy-falls-and-goodfellow-track-loop/ At this moment adding any content is fairly geeky job but don't fear and try to play with us, it's going to be fun.

So let's dive into technical stuff a little bit. The Kiwipedia website is build on top of the static site generator called [Hugo](https://gohugo.io/) and hosted on the [Github](https://github.com/nztomas/kiwipedia.nz). Anyone can add a new article or fix somethig broken by simply cloning the repository and sending a pull request back to us (sounds really easy, eh? :)

As a frontend tools we use bootstrap for CSS and RiotJS as our javascript tool set. At the backend side for run our stuff Java Google App Engine and use couple of Google services as data stores - Google Cloud Storade, Google Fusion Tables, Images services and other. We are aiming to expose all of our data through rest services, you can already have a look and reverse engineer how our UI communicate with backend if you wish - but take them as a alpha versions and expect rapid unannounced changes.

So yeah, if you like the idea, or you want to try something new and usefull or you just love New Zealand and have stories to share, bring it on! If you are not sure where to start don't hesitate to flick us an email.