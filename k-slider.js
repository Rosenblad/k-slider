/**
 * Konsulterna Slider
 *
 * Author: Webbyrån Konsulterna
 * Author URL: webbyrankonsulterna.se
 */

Array.prototype.rotate = function(n) {
  this.unshift.apply( this, this.splice( n, this.length ) )
  return this
}

var state = {
	sliderOpen: false,
	activeSlider: null,
	activeSlide: null,
	activeSlideId: null,
	activeSlideIndex: null,
}

const selectors = {
  slider: 'k-slider',
  sliderAnimating: 'k-slider--animating',

  slide: 'k-slider__slide',
  slideActive: 'k-slider__slide--active',
  
  triggerNext: 'k-slider__next',
  triggerPrev: 'k-slider__prev',
  triggerOpen: '[data-slider]',
}

/**
 * Opens a slider and sets currently active slide based on trigger
 */
function openSlider(e) {
	var sliderId = e.target.getAttribute('data-slider')
	var slider = document.querySelector('#' + sliderId)
	var slides = slider.children

	state.sliderOpen = true
	state.activeSlider = slider

	// Set open styles
	slider.style.opacity = 1
	slider.style.visibility = 'visible'

  const slideTrigger = e.target
  const sliderGroup = e.target.parentNode
  const slideTriggers = sliderGroup.querySelectorAll('[data-slide]')

  for( var i = 0; i < slideTriggers.length; ++i ){
    if( slideTrigger === slideTriggers[i] ){
      calculatePositions(slider)
    }
  }
}

/**
 * Moves slide in a slider to wanted positions
 */
function moveSlide(slide, position, animate) {
  const slider = slide.parentNode.parentNode
  state.activeSlide = slide

  if (animate) {
    slider.classList.add(selectors.sliderAnimating)
    TweenLite.to(slide, 1, {
      left: position + '%',
      onComplete: () => {
        slider.classList.remove(selectors.sliderAnimating)
      }
    })
  } else {
    TweenLite.to(slide, 0, { 
      left: position + '%' 
    })
  }
}

/**
 * Calculates slide positions based on currently active slide
 */
function calculatePositions(slider, direction) {
  var slides = slider.querySelector('.k-slider__slides').children
  var numSlides = slides.length
  var rotatedSlides = Slider.rotateSlides(slides)

  // If there is only one slide we move it to the middle
  if (slides.length === 1) {
    slides[0].style.left = 0
    return
  }
  
  let position = -100
  for( var i = 0; i < rotatedSlides.length; ++i ){

  	var slide = rotatedSlides[i]

    if( direction === 'right' ){

      if (numSlides === 2) {
        let nextPosition = position

        if (nextPosition === 0) {
          moveSlide(slide, 100, false)
          moveSlide(slide, 0, true)
        } else {
          moveSlide(slide, -100, true)
        }
      }

      if (numSlides >= 3) {

        if (position === 0 || position === -100) {
          moveSlide(slide, position, true)
        } else {
          moveSlide(slide, position, false)
        }

      }
    }

    if (direction === 'left') {

      if (numSlides === 2) {
        let nextPosition = position

        if (nextPosition === 0) {
          moveSlide(slide, -100, false)
          moveSlide(slide, 0, true)
        } else {
          moveSlide(slide, 100, true)
        }
      }

      if (numSlides >= 3) {

        if (position === 0 || position === 100) {
          moveSlide(slide, position, true, 'left')
        } else {
          moveSlide(slide, position, false, 'left')
        }

      }

    }

    if (!direction) {
      moveSlide(slide, position, false)
    }

    position = position + 100
  }

}

/**
 * Generates sliders and appends them to the document body element
 */
function generateSliders() {
  var body = document.querySelector('body')
  var sliders = document.querySelectorAll('.k-slider')

  for( var i = 0; i < sliders.length; ++i ){
    var sliderId = sliders[i].getAttribute('data-slider')
    var slides = sliders[i].querySelectorAll('[data-slide]')

    sliders[i].style.overflow = 'hidden'

    // Create slides container element
    var slidesContainer = document.createElement('div')
    slidesContainer.setAttribute('class', 'k-slider__slides')

    // Create slider controls
    var sliderControls = document.createElement('div')
    var sliderPrev = document.createElement('div')
    var sliderNext = document.createElement('div')

    sliderControls.setAttribute('class', 'k-slider__controls')
    sliderPrev.setAttribute('class', 'k-slider__prev')
    sliderNext.setAttribute('class', 'k-slider__next')

    sliderControls.appendChild(sliderPrev)
    sliderControls.appendChild(sliderNext)

    // Create slides
    for( var j = 0; j < slides.length; ++j ){
      
      // Get slide background
      var slideBackground = slides[j].getAttribute('data-slide')

      // Remove old slide element
      sliders[i].removeChild(slides[j])

      // Create new slide
      var slide = document.createElement('div')

      slide.style.height = '100%'
      slide.style.position = 'absolute'
      slide.style.width = '100%'
      slide.style.backgroundSize = 'contain'
      slide.style.backgroundRepeat = 'no-repeat'
      slide.style.backgroundPosition = 'center'
      slide.style.backgroundImage = 'url(' + slideBackground + ')'

      // Append new slide to slide container
      slidesContainer.appendChild(slide)
    }

    // Append slider controls to slider container

    // Append slides container to slider
    sliders[i].appendChild(slidesContainer)
    sliders[i].appendChild(sliderControls)
  }
}

function bindEvents() {

	/**
	 * Trigger open
	 */
	const triggerOpen = document.querySelectorAll('[data-slider]')
	for( var i = 0; i < triggerOpen.length; ++i ){
		triggerOpen[i].addEventListener( 'click', openSlider )
	}

  // Trigger next slide event
  const triggerNext = document.querySelectorAll('.' + selectors.triggerNext)
  for( var i = 0; i < triggerNext.length; ++i ){
  	triggerNext[i].addEventListener('click', Slider.slide, false)
  }

  // Trigger previous slide event
  const triggerPrev = document.querySelectorAll('.' + selectors.triggerPrev)
  for( var i = 0; i < triggerPrev.length; ++i ){
  	triggerPrev[i].addEventListener('click', Slider.slide, false)
  }

  // Trigger close when clicking slider background
  const sliders = document.querySelectorAll('.k-slider')
  for( var i = 0; i < sliders.length; ++i ){
		sliders[i].addEventListener('click', function(e) {
      if (e.target.classList.contains('k-slider') ||
          e.target.classList.contains('k-slider__slide')) 
        Slider.close()
    }, false)
  }

  // Trigger open when clicking on an element inside of a slidergroup
  // const triggerOpen = document.querySelectorAll('[data-slider] [data-slide]')
}

class Slider {

	constructor() {

	}

  static close() {
    const sliders = document.querySelectorAll('.k-slider')

    for( var i = 0; i < sliders.length; ++i ){
			var slides = sliders[i].querySelectorAll('.k-slider__slide')

			for( var j = 0; j < slides.length; ++j ){
				slides[i].classList.remove('k-slider__slide--active')
			}
    }
  }

  static slide(e) {
    var slider = state.activeSlider
    var slidesContainer = slider.querySelector('.k-slider__slides')

    if (slider.classList.contains(selectors.sliderAnimating)) return false

    var slides = slidesContainer.children,
        direction

    if (slides.length === 1) return

    // Rotate slides in order to loop the slider
    slides = Slider.rotateSlides(slides)

    const activeSlide = slides[1]

    // Remove active class from previously active slide    
    activeSlide.classList.remove(selectors.slideActive)

    // If the next button was clicked
    if (e.target.classList.contains(selectors.triggerNext)) {
      let nextSlide = (slides.length > 2) ? slides[2] : slides[0]
      nextSlide.classList.add(selectors.slideActive)
      direction = 'right'
    }

    // If the previous button was clicked
    if (e.target.classList.contains(selectors.triggerPrev)) {
      let previousSlide = slides[0]
      previousSlide.classList.add(selectors.slideActive)
      direction = 'left'
    }

    // Update position of slides
    calculatePositions(slider, direction)
  }

  static rotateSlides(slides) {
    let index

    let temp = []
    for( var i = 0; i < slides.length; i++ ){
    	temp.push(slides[i])
    }

    slides = temp

    // Get index of currently active slide
    for (let i = 0; i < slides.length; ++i) {
      if (slides[i].classList.contains(selectors.slideActive)) {
        index = i
      }
    }
    
    // rotate slides array
    if (index === 0) {
      slides.rotate(-1)
    } else if (index > 1) {
      slides.rotate(index - slides.length - 1)
    }

    return slides
  }

  static init() {
    generateSliders()
    bindEvents()

    // Calculate positins for every slide in all sliders
    const sliders = document.querySelectorAll('.k-slider')
    for( var i = 0; i < sliders.length; ++i ){
    	calculatePositions(sliders[i])
    }
  }
}

export default Slider
