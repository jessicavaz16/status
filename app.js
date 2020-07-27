const stories = [
  {
    title: 'Jessica',
    gmttime:'10:59pm',
    profile: 'images/profile-pic.jpg',
    description: 'Happy Birthday Ananya🥳😘!Stay Blessed💖',
    image: 'images/birthday2.jpg',
    time: 3500
  },
  {
    title: 'Deepika',
    gmttime:'08:30pm',
    profile: 'images/profile-pic2.jpg',
    description: 'Besties forever😘',
    image: 'images/friends.jpg',
    time: 4000
  },{
    title: 'Shirley',
    gmttime:'05:45pm',
    profile: 'images/profile-pic3.png',
    description: 'Morning View at the top of Nandi hills! Beauty😍',
    image: 'images/nandi.jpg',
    time: 2500
  },
  {
    title: 'Omkar',
    gmttime:'03:12pm',
    profile: 'images/profile-pic4.jpg',
    description: '',
    image: 'images/happy.jpg',
    time: 7500
  }
]

const container = document.querySelector('.container')
const nextButton = document.querySelector('#next')
const backButton = document.querySelector('#back')

function Storyfier(storiesArray, rootEl) {
  this.stories = storiesArray
  this.root = rootEl
  this.times = rootEl.querySelector('#times')
  this.currentTime = 0
  this.currentIndex = 0

  // create breakpoints for when the slides should change
  this.intervals = this.stories.map((story, index) => {
    // TODO change so that it just uses the previous value + current time
    let sum = 0
    for (let i = 0; i < index; i++){
      sum += this.stories[i].time
    }
    return sum
  })

  // necessary to make sure the last slide plays to completion
  this.maxTime = this.intervals[this.intervals.length - 1] + this.stories[this.stories.length - 1].time

  // render progress bars
  this.progressBars = this.stories.map(() => {
    const el = document.createElement('div')
    el.classList.add('time-item')
    el.innerHTML = '<div style="width: 0%"></div>'
    return el
  })

  this.progressBars.forEach((el) => {
    this.times.appendChild(el)
  })

  // methods
  this.render = () => {
    const story = this.stories[this.currentIndex]
    this.root.style.background = `url('${story.image}')`
    if(this.stories[this.currentIndex]==this.stories[0])
    {
    
    this.root.style.backgroundSize = "500px 500px";
    this.root.style.backgroundRepeat = "no-repeat";
    this.root.style.backgroundPosition = "center center";
    this.root.style.backgroundColor="black";
    this.root.querySelector('#content').style.backgroundColor="#111"
  }


    if(this.stories[this.currentIndex]==this.stories[1]){

      
      this.root.style.backgroundSize = "500px 500px";
      this.root.style.backgroundRepeat = "no-repeat";
      this.root.style.backgroundPosition = "center center";
      this.root.style.backgroundColor="black";
      this.root.querySelector('#content').style.backgroundColor="#111"
    }

    if(this.stories[this.currentIndex]==this.stories[2]){

      this.root.style.backgroundSize = "cover";
      this.root.style.backgroundRepeat = "no-repeat";
      this.root.style.backgroundPosition = "center center";
      this.root.style.backgroundColor="black";
      this.root.querySelector('#content').style.backgroundColor="rgba(20, 18, 18, 0.7)";
    }

    if(this.stories[this.currentIndex]==this.stories[3]){

      this.root.style.backgroundSize = "500px 550px";
      this.root.style.backgroundRepeat = "no-repeat";
      this.root.style.backgroundPosition = "center center";
      this.root.style.backgroundColor="black";
      this.root.querySelector('#content').style.backgroundColor="#111"
    }
    this.root.querySelector('#gmt-time').innerHTML = story.gmttime
    this.root.querySelector('#profile-pic').src=story.profile
    this.root.querySelector('#title').innerHTML = story.title
    this.root.querySelector('#description').innerHTML = story.description
  }

  this.updateProgress = () => {
    this.progressBars.map((bar, index) => {
      // Fill already passed bars
      if (this.currentIndex > index) {
        bar.querySelector('div').style.width = '100%'
        return
      }

      if (this.currentIndex < index) {
        bar.querySelector('div').style.width = '0%'
        return
      }

      // update progress of current bar
      if (this.currentIndex == index) {
        const timeStart = this.intervals[this.currentIndex]

        let timeEnd;
        if (this.currentIndex == this.stories.length - 1){
          timeEnd = this.maxTime
        } else {
          timeEnd = this.intervals[this.currentIndex + 1]
        }

        const animatable = bar.querySelector('div')
        animatable.style.width = `${((this.currentTime - timeStart)/(timeEnd - timeStart))*100}%`


      }
    })
  }
}

Storyfier.prototype.start = function(){
  // Render initial state
  this.render()

  // START INTERVAL
  const test = setInterval(() => {
    this.currentTime += 10
    this.updateProgress()

    if (this.currentIndex >= this.stories.length - 1 && (this.currentTime > this.maxTime)){
      clearInterval(test)
      return
    }

    const lastIndex = this.currentIndex
    if (this.currentTime >= this.intervals[this.currentIndex + 1]){
      this.currentIndex += 1
    }

    if (this.currentIndex != lastIndex) {
      this.render()
    }
  }, 10)
}

Storyfier.prototype.next = function(){
  const next = this.currentIndex + 1
  if (next > this.stories.length - 1){
    return
  }

  this.currentIndex = next
  this.currentTime = this.intervals[this.currentIndex]
  this.render()
}

Storyfier.prototype.back = function(){
  if ((this.currentTime > (this.intervals[this.currentIndex] + 350)) || this.currentIndex === 0){
    this.currentTime = this.intervals[this.currentIndex]
    return
  }

  this.currentIndex -= 1
  this.currentTime = this.intervals[this.currentIndex]
  this.render()
}

const setup = async () => {
  const loadImages = stories.map(({ image }) => {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => {
        resolve(image)
      }
      img.src = image
    })
  })

  await Promise.all(loadImages)

  const s = new Storyfier(stories, container);
  s.start()

  nextButton.addEventListener('click', () => {
    s.next()
  })

  backButton.addEventListener('click', () => {
    s.back()
  })
}

setup()
