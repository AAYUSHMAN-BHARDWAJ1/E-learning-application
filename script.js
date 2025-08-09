// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link")
  const pages = document.querySelectorAll(".page")

  // Handle navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all links and pages
      navLinks.forEach((l) => l.classList.remove("active"))
      pages.forEach((p) => p.classList.remove("active"))

      // Add active class to clicked link
      this.classList.add("active")

      // Show corresponding page
      const pageId = this.getAttribute("data-page")
      document.getElementById(pageId).classList.add("active")
    })
  })

  // Enhanced search functionality with debouncing
  const searchInput = document.querySelector(".search-input")
  let searchTimeout

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        performSearch(this.value)
      }, 300)
    })
  }

  function performSearch(searchTerm) {
    const courseCards = document.querySelectorAll("#courses .course-card")
    let visibleCount = 0

    courseCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase()
      const description = card.querySelector("p").textContent.toLowerCase()
      const category = card.querySelector(".course-category, .course-badge")?.textContent.toLowerCase() || ""

      if (
        title.includes(searchTerm.toLowerCase()) ||
        description.includes(searchTerm.toLowerCase()) ||
        category.includes(searchTerm.toLowerCase())
      ) {
        card.style.display = "block"
        visibleCount++
      } else {
        card.style.display = "none"
      }
    })

    // Show search results count
    if (searchTerm) {
      showNotification(`Found ${visibleCount} courses matching "${searchTerm}"`, "info", 2000)
    }
  }

  // Enhanced filter functionality
  const filterSelects = document.querySelectorAll(".filter-select")
  filterSelects.forEach((select) => {
    select.addEventListener("change", () => {
      applyFilters()
    })
  })

  function applyFilters() {
    const categoryFilter = document.querySelector(".filter-select:nth-child(2)").value.toLowerCase()
    const levelFilter = document.querySelector(".filter-select:nth-child(3)").value.toLowerCase()
    const courseCards = document.querySelectorAll("#courses .course-card")
    let visibleCount = 0

    courseCards.forEach((card) => {
      const category = card.querySelector(".course-category")?.textContent.toLowerCase() || ""
      const level = card.querySelector(".course-badge")?.textContent.toLowerCase() || ""

      let showCard = true

      if (categoryFilter !== "all categories" && !category.includes(categoryFilter)) {
        showCard = false
      }

      if (levelFilter !== "all levels" && !level.includes(levelFilter)) {
        showCard = false
      }

      if (showCard) {
        card.style.display = "block"
        visibleCount++
      } else {
        card.style.display = "none"
      }
    })

    if (categoryFilter !== "all categories" || levelFilter !== "all levels") {
      showNotification(`Filtered to ${visibleCount} courses`, "info", 2000)
    }
  }

  // Enhanced favorite functionality
  const favoriteButtons = document.querySelectorAll(".btn-icon")
  favoriteButtons.forEach((button) => {
    if (button.querySelector(".fa-heart")) {
      button.addEventListener("click", function (e) {
        e.stopPropagation()
        const icon = this.querySelector("i")

        if (icon.classList.contains("far")) {
          icon.classList.remove("far")
          icon.classList.add("fas")
          this.classList.add("active")
          showNotification("Added to favorites", "success")
        } else {
          icon.classList.remove("fas")
          icon.classList.add("far")
          this.classList.remove("active")
          showNotification("Removed from favorites", "info")
        }
      })
    }
  })

  // Enhanced enrollment functionality
  const enrollButtons = document.querySelectorAll("#courses .btn-primary")
  enrollButtons.forEach((button) => {
    if (button.textContent.includes("Enroll")) {
      button.addEventListener("click", function () {
        const courseCard = this.closest(".course-card")
        const courseTitle = courseCard.querySelector("h3").textContent
        const coursePrice = courseCard.querySelector(".price").textContent

        // Show loading
        showLoading()
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
        this.disabled = true

        // Simulate enrollment process
        setTimeout(() => {
          hideLoading()

          // Update button
          this.innerHTML = '<i class="fas fa-check"></i> Enrolled'
          this.style.background = "var(--success-gradient)"
          this.disabled = false

          // Show success notification
          showNotification(`Successfully enrolled in ${courseTitle} for ${coursePrice}!`, "success")

          // Update stats
          updateStats()
        }, 2000)
      })
    }
  })

  // Progress tracking simulation
  const markCompleteButtons = document.querySelectorAll(".video-controls .btn-primary")
  markCompleteButtons.forEach((button) => {
    if (button.textContent === "Mark as Complete") {
      button.addEventListener("click", function () {
        this.textContent = "Completed"
        this.style.background = "#4CAF50"
        showNotification("Lesson marked as complete!")
        updateProgress()
      })
    }
  })

  // Initialize progress animations
  animateProgressBars()

  // Initialize circular progress
  initCircularProgress()

  // Enhanced tab functionality for profile page
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab")

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      this.classList.add("active")
      document.getElementById(targetTab).classList.add("active")
    })
  })

  // Auto-save notes functionality
  const notesInput = document.querySelector(".notes-input")
  if (notesInput) {
    let saveTimeout
    notesInput.addEventListener("input", function () {
      clearTimeout(saveTimeout)
      saveTimeout = setTimeout(() => {
        // Simulate auto-save
        console.log("Notes auto-saved:", this.value)
        showNotification("Notes saved", "success", 1000)
      }, 2000)
    })
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Close modal with Escape
    if (e.key === "Escape") {
      const modal = document.getElementById("videoModal")
      if (modal.style.display === "block") {
        closeVideoPlayer()
      }
    }

    // Space bar to play/pause video
    if (e.code === "Space" && document.getElementById("videoModal").style.display === "block") {
      e.preventDefault()
      const video = document.getElementById("courseVideo")
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    }

    // Arrow keys for video seeking
    if (document.getElementById("videoModal").style.display === "block") {
      const video = document.getElementById("courseVideo")
      if (e.key === "ArrowLeft") {
        video.currentTime = Math.max(0, video.currentTime - 10)
      } else if (e.key === "ArrowRight") {
        video.currentTime = Math.min(video.duration, video.currentTime + 10)
      }
    }
  })

  // Initialize animations and interactions
  initializeAnimations()
  initializeIntersectionObserver()
})

// Enhanced video player functionality
let currentVideoSrc = ""
const videoProgress = 0

function openVideoPlayer(courseTitle, lessonTitle, videoSrc = "") {
  const modal = document.getElementById("videoModal")
  const videoTitleElement = document.getElementById("videoTitle")
  const lessonTitleElement = document.getElementById("lessonTitle")
  const video = document.getElementById("courseVideo")
  const overlay = document.getElementById("videoOverlay")

  videoTitleElement.textContent = courseTitle
  lessonTitleElement.textContent = lessonTitle
  currentVideoSrc = videoSrc

  modal.style.display = "block"
  document.body.style.overflow = "hidden"

  // Show loading overlay
  overlay.style.display = "flex"

  // Set video source if provided
  if (videoSrc) {
    video.src = videoSrc
  }

  // Simulate video loading
  setTimeout(() => {
    overlay.style.display = "none"
    video.play().catch((e) => {
      console.log("Video autoplay prevented:", e)
      showNotification("Click play to start the video", "info")
    })
  }, 1500)

  // Initialize video event listeners
  initVideoEventListeners()
}

function closeVideoPlayer() {
  const modal = document.getElementById("videoModal")
  const video = document.getElementById("courseVideo")

  video.pause()
  video.currentTime = 0
  modal.style.display = "none"
  document.body.style.overflow = "auto"

  // Reset progress
  updateLessonProgress(0)
}

function initVideoEventListeners() {
  const video = document.getElementById("courseVideo")
  const fullscreenBtn = document.getElementById("fullscreenBtn")
  const markCompleteBtn = document.getElementById("markCompleteBtn")
  const prevBtn = document.getElementById("prevLessonBtn")
  const nextBtn = document.getElementById("nextLessonBtn")

  // Video progress tracking
  video.addEventListener("timeupdate", () => {
    if (video.duration) {
      const progress = (video.currentTime / video.duration) * 100
      updateLessonProgress(progress)

      // Auto-mark as complete when 90% watched
      if (progress >= 90 && !markCompleteBtn.classList.contains("completed")) {
        markCompleteBtn.innerHTML = '<i class="fas fa-check"></i> Mark as Complete'
        markCompleteBtn.style.background = "var(--success-gradient)"
      }
    }
  })

  // Fullscreen functionality
  fullscreenBtn.addEventListener("click", () => {
    if (video.requestFullscreen) {
      video.requestFullscreen()
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen()
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen()
    }
  })

  // Mark complete functionality
  markCompleteBtn.addEventListener("click", function () {
    if (!this.classList.contains("completed")) {
      this.innerHTML = '<i class="fas fa-check-circle"></i> Completed'
      this.classList.add("completed")
      this.style.background = "#10b981"
      showNotification("Lesson marked as complete!", "success")
      updateProgress()

      // Update lesson progress to 100%
      updateLessonProgress(100)
    }
  })

  // Navigation buttons
  prevBtn.addEventListener("click", () => {
    showNotification("Loading previous lesson...", "info")
    // Simulate loading previous lesson
    setTimeout(() => {
      showNotification("Previous lesson loaded", "success")
    }, 1000)
  })

  nextBtn.addEventListener("click", () => {
    showNotification("Loading next lesson...", "info")
    // Simulate loading next lesson
    setTimeout(() => {
      showNotification("Next lesson loaded", "success")
    }, 1000)
  })
}

function updateLessonProgress(percentage) {
  const progressFill = document.getElementById("lessonProgress")
  const progressText = document.getElementById("progressText")

  if (progressFill && progressText) {
    progressFill.style.width = percentage + "%"
    progressText.textContent = Math.round(percentage) + "%"
  }
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("videoModal")
  if (event.target === modal) {
    closeVideoPlayer()
  }
})

// Progress bar animation
function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-fill")

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target
        const width = progressBar.style.width
        progressBar.style.width = "0%"

        setTimeout(() => {
          progressBar.style.width = width
        }, 100)
      }
    })
  })

  progressBars.forEach((bar) => {
    observer.observe(bar)
  })
}

// Circular progress initialization
function initCircularProgress() {
  const circle = document.querySelector(".progress-ring-fill")
  if (circle) {
    const radius = circle.r.baseVal.value
    const circumference = radius * 2 * Math.PI
    const percentage = 60 // 60% progress
    const offset = circumference - (percentage / 100) * circumference

    circle.style.strokeDasharray = `${circumference} ${circumference}`
    circle.style.strokeDashoffset = offset
  }
}

// Enhanced notification system with queue
const notificationQueue = []
let isShowingNotification = false

function showNotification(message, type = "success", duration = 4000) {
  notificationQueue.push({ message, type, duration })
  processNotificationQueue()
}

function processNotificationQueue() {
  if (isShowingNotification || notificationQueue.length === 0) return

  isShowingNotification = true
  const { message, type, duration } = notificationQueue.shift()

  const container = document.getElementById("notification-container") || createNotificationContainer()

  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  const content = document.createElement("div")
  content.className = "notification-content"

  const icon = document.createElement("div")
  icon.className = "notification-icon"

  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i",
  }

  icon.textContent = iconMap[type] || iconMap.success

  const text = document.createElement("div")
  text.className = "notification-text"
  text.textContent = message

  content.appendChild(icon)
  content.appendChild(text)
  notification.appendChild(content)

  container.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Remove after duration
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (container.contains(notification)) {
        container.removeChild(notification)
      }
      isShowingNotification = false
      processNotificationQueue() // Process next notification
    }, 300)
  }, duration)
}

function createNotificationContainer() {
  const container = document.createElement("div")
  container.id = "notification-container"
  container.className = "notification-container"
  document.body.appendChild(container)
  return container
}

// Enhanced loading overlay
function showLoading() {
  const overlay = document.getElementById("loading-overlay")
  if (overlay) {
    overlay.style.display = "flex"
  }
}

function hideLoading() {
  const overlay = document.getElementById("loading-overlay")
  if (overlay) {
    overlay.style.display = "none"
  }
}

// Update stats simulation
function updateStats() {
  const enrolledStat = document.querySelector(".stat-card:first-child .stat-info h3")
  const currentCount = Number.parseInt(enrolledStat.textContent)
  enrolledStat.textContent = currentCount + 1
}

// Update progress simulation
function updateProgress() {
  const progressBars = document.querySelectorAll(".progress-fill")
  progressBars.forEach((bar) => {
    const currentWidth = Number.parseInt(bar.style.width)
    if (currentWidth < 100) {
      bar.style.width = Math.min(currentWidth + 10, 100) + "%"
    }
  })

  // Update circular progress
  const circle = document.querySelector(".progress-ring-fill")
  const progressText = document.querySelector(".progress-text")
  if (circle && progressText) {
    const currentProgress = Number.parseInt(progressText.textContent)
    const newProgress = Math.min(currentProgress + 5, 100)
    progressText.textContent = newProgress + "%"

    const radius = circle.r.baseVal.value
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (newProgress / 100) * circumference
    circle.style.strokeDashoffset = offset
  }
}

// Smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add loading states for better UX
function addLoadingState(button) {
  const originalText = button.textContent
  button.textContent = "Loading..."
  button.disabled = true

  setTimeout(() => {
    button.textContent = originalText
    button.disabled = false
  }, 1000)
}

// Form validation for profile page
const profileForm = document.querySelector(".profile-form")
if (profileForm) {
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const saveButton = this.querySelector(".btn-primary")
    addLoadingState(saveButton)

    setTimeout(() => {
      showNotification("Profile updated successfully!")
    }, 1000)
  })
}

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  // Close modal with Escape key
  if (e.key === "Escape") {
    const modal = document.getElementById("videoModal")
    if (modal.style.display === "block") {
      closeVideoPlayer()
    }
  }

  // Navigate with arrow keys
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    const activeNavLink = document.querySelector(".nav-link.active")
    const navLinks = Array.from(document.querySelectorAll(".nav-link"))
    const currentIndex = navLinks.indexOf(activeNavLink)

    let newIndex
    if (e.key === "ArrowLeft") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1
    } else {
      newIndex = currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0
    }

    navLinks[newIndex].click()
  }
})

// Auto-save functionality for forms
const formInputs = document.querySelectorAll(".form-input")
formInputs.forEach((input) => {
  input.addEventListener("input", function () {
    // Simulate auto-save
    clearTimeout(this.saveTimeout)
    this.saveTimeout = setTimeout(() => {
      console.log("Auto-saved:", this.value)
    }, 1000)
  })
})

// Performance optimization: Lazy loading for images
const images = document.querySelectorAll("img")
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.src // Trigger loading
      img.classList.add("loaded")
      observer.unobserve(img)
    }
  })
})

images.forEach((img) => {
  imageObserver.observe(img)
})

function initializeAnimations() {
  // Logo animation on hover
  const logo = document.querySelector(".logo-icon")
  if (logo) {
    logo.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) rotate(10deg)"
    })

    logo.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) rotate(0deg)"
    })
  }

  // Stat cards animation
  const statCards = document.querySelectorAll(".stat-card")
  statCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
    card.classList.add("animate-in")
  })
}

function initializeIntersectionObserver() {
  // Animate elements when they come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")

        // Animate progress bars
        if (entry.target.classList.contains("progress-fill")) {
          const width = entry.target.style.width
          entry.target.style.width = "0%"
          setTimeout(() => {
            entry.target.style.width = width
          }, 200)
        }
      }
    })
  }, observerOptions)

  // Observe course cards and progress bars
  document.querySelectorAll(".course-card, .progress-fill, .stat-card").forEach((el) => {
    observer.observe(el)
  })
}
