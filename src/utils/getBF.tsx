import axios from "axios"

export async function getBF (): Promise<any> {
  axios.get('/place/bf', {
    headers: { 'Content-Type': 'application/json' }
  }).then(resp => {
    return resp.data.places
  })
}