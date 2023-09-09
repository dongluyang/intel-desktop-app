import marked from 'marked'
import sanitizeHTML from 'sanitize-html'
import { formatFrame, formatTime } from './video'

export const TIME_CODE_REGEX = /v(\d+) (\d+):(\d+)\.(\d+) \((\d+)\)/g

export const sanitize = (html) => {
  return sanitizeHTML(html, {
    allowedTags: sanitizeHTML.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      a: ['class', 'href'],
      img: ['src']
    }
  })
}

export const getTaskTypeStyle = (task) => {
  let border = 'transparent'
  if (task) border = task.task_type_color
  return {
    'border-left': `4px solid ${border}`
  }
}

export const renderComment = (
  input, mentions, personMap, className = ''
) => {
  let compiled = marked(input || '')
  if (mentions) {
    mentions.forEach(personId => {
      const person = personMap.get(personId)
      compiled = compiled.replaceAll(
        `@${person.full_name}`,
        `<a class="mention" href="/people/${person.id}">@${person.full_name}</a>`
      )
    })
  }
  compiled = sanitize(compiled)

  return compiled.replaceAll(
    TIME_CODE_REGEX,
    (match, p1, p2, p3, p4, p5, offset, string) => {
      return `<a
        class="timecode ${className}"
        href="#"
        data-version-revision="${p1}"
        data-minutes="${p2}"
        data-seconds="${p3}"
        data-milliseconds="${p4}"
        data-frame="${p5}"
      >${match}</a>`
    }
  )
}

export const renderMarkdown = (input) => {
  const compiled = marked(input || '')
  return sanitize(compiled)
}

export const replaceTimeWithTimecode = (
  comment,
  currentPreviewRevision,
  currentTimeRaw,
  fps
) => {
  if (comment) {
    const frame = formatFrame(currentTimeRaw, fps)
    const formatedTime = formatTime(currentTimeRaw)
    return comment.replaceAll(
      '@frame', `v${currentPreviewRevision} ${formatedTime} (${frame})`
    )
  } else {
    return ''
  }
}
