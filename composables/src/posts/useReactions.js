import { useGun, currentRoom, isEmoji, useUser, reactToPost } from '@composables';
import { reactive, ref, computed } from 'vue'


export function useReactions(authors) {
  const reactions = {}
  for (let pub in authors) {
    let reaction = authors[pub]
    if (reaction) {
      reactions[reaction] = reactions[reaction] || []
      reactions[reaction].push(pub)
    }

  }
  return reactions
}

export function countRating(authors) {
  let count = 0
  for (let author in authors) {
    if (authors[author] && authors[author] != '🗑') {
      count++
    } else if (authors[author] == '🗑') {
      count--
    }
  }
  return count
}


export function useUserPosts(pub) {
  const gun = useGun()
  const posts = reactive({})
  gun.user(currentRoom.pub).get('posts').map().on((d, k) => {
    let author = k.slice(-87);
    let to = k.substring(0, 44)
    if (author == pub) {
      if (d) {
        posts[d] = posts[d] || {}
        posts[d][to] = d
      } else {
        console.log(d)
        delete posts?.[d]?.[to]
      }
    }
  })
  return posts
}

export function useUserLinks(pub) {
  const gun = useGun()
  const reactions = reactive({})
  gun.user(currentRoom.pub).get('links').map().on((d, k) => {
    let author = k.slice(90);
    let from = k.substring(0, 44)
    let to = k.substring(45, 89)
    if (author == pub) {

      if (d) {
        reactions[d] = reactions[d] || {}
        reactions[d][to] = from
      } else {
        delete reactions?.[d]?.[to]
      }

    }
  })
  return reactions
}