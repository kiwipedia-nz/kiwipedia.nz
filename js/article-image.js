<article-image>

riot.tag2('div', '<div each="{info in infos.data}"> distance: {info.distance} </div>', '', 'if="{infos.data}"', function(opts) {
});

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

riot.tag2('style', '', '', '', function(opts) {
});
</track-info>
