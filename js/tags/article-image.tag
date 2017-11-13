<article-image>

<div if={ infos.data }>
	<div each={ info in infos.data }>
    distance: { info.distance }
  </div>
</div>

	<script>
  	var self = this;

    this.onArticleImageUpdated = function(articleImage) {
      console.log('article updated: ' + articleImage);
    }

    if (self.articleId) {
      RiotControl.one('article-image-updated' + self.articleId, self.onArticleImageUpdated);
      RiotControl.trigger('article-image-required', self.articleId);
    }

  </script>

  <style>
  </style>
</track-info>
