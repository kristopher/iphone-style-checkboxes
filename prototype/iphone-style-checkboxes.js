var iPhoneStyle = function(selector_or_elem, options) {
  var text_selection_event = (Prototype.Browser.IE && 'startselect' || 'mousedown')
  var elements = (Object.isElement(selector_or_elem) && [selector_or_elem] || $$(selector_or_elem))
  var default_options = { 
    checkedLabel: 'ON', uncheckedLabel: 'OFF', background: '#fff',
    containerClass:    'iPhoneCheckContainer',
    labelOnClass:      'iPhoneCheckLabelOn',
    labelOffClass:     'iPhoneCheckLabelOff',
    handleClass:       'iPhoneCheckHandle',
    handleSliderClass: 'iPhoneCheckHandleSlider'
  }

  options = Object.extend(Object.clone(default_options), options);
    
  return elements.each(function(elem) {
    
    if (!elem.match('input[type=checkbox]'))
      return;
    
    elem.setOpacity(0);
    elem.wrap('div', { 'class': options.containerClass});
    elem.insert({ 'after': '<div class="' + options.handleClass + '"><div class="' + options.handleSliderClass + '" /></div>' })
        .insert({ 'after': '<label class="' + options.labelOffClass + '">'+ options.uncheckedLabel + '</label>' })
        .insert({ 'after': '<label class="' + options.labelOnClass + '">' + options.checkedLabel   + '</label>' });
    
    var handle    = elem.up().down('.' + options.handleClass),
        offlabel  = elem.adjacent('.' + options.labelOffClass).first(),
        onlabel   = elem.adjacent('.' + options.labelOnClass).first(),
        container = elem.up('.' + options.containerClass),
        rightside = container.getWidth() - 39;
        
    
    container.observe('mouseup', function() {
      var is_onstate = Number(elem.checked);
    
      new Effect.Tween(null, is_onstate, Number(!is_onstate), { duration: 0.2 }, function(p) { handle.setStyle({ left: p * rightside + 'px' }) });
      
      if (is_onstate) {
        offlabel.appear({ duration: 0.2 });
        onlabel.fade({ duration: 0.2 });
      } else {
        offlabel.fade({ duration: 0.2 });
        onlabel.appear({ duration: 0.2 });
      }
      
      elem.checked = !is_onstate
    });
    
    // Disable text selection
    [container, onlabel, offlabel, handle].invoke('observe', text_selection_event, function(e) { e.stop(); });
    
    // initial load
    if (elem.checked) {
      offlabel.setOpacity(0);
      onlabel.setOpacity(1);
      handle.setStyle({ left: rightside + 'px'});
    }
  }, this);
};