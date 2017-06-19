<div class="copyright" >
  {% set current = date(Date.now(), "YYYY") %}
  &copy; {% if theme.since and theme.since != current %} {{ theme.since }} - {% endif %}
  <span itemprop="copyrightYear">{{ current }}</span>
  <span class="with-love">
    <i class="fa fa-{{ theme.authoricon }}"></i>
  </span>
  <span class="author" itemprop="copyrightHolder">{{ config.author }}</span>
  <span class="with-love">
    <i class="fa fa-{{ theme.authoricon }}"></i>
  </span>
  <span class="author" ><a href="http://www.icpcha.net/icp/mythsman.com" rel="no follow">苏ICP备15055270号</a></span>
</div>

{% if theme.copyright %}
<div class="powered-by">
  {{ __('footer.powered', '<a class="theme-link" rel="external nofollow" href="https://hexo.io">Hexo</a>') }}
</div>

<div class="theme-info">
  {{ __('footer.theme') }} -
  <a class="theme-link" href="https://github.com/iissnan/hexo-theme-next rel="external nofollow"">
    NexT.{{ theme.scheme }}
  </a>
</div>
{% endif %}

<script type="text/javascript" src="/js/src/background.js"></script>
