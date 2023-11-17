

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    _apiKey = 'apikey=bbce2348c626267f563208230cd8f734'
    _baseOffsetChar = 210

    _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? (char.description.length < 180 ? char.description : char.description.slice(0, 180) + '...') : 'Information about this character is not found',
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    getResource = async (url) => {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`Ошибкаааа, could not fetch ${url}`)
        } else {
            return await res.json()
        }
    }

    getAllCharacters = async (offset = this._baseOffsetChar) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`)
        return res.data.results.map(this._transformCharacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`)
        return this._transformCharacter(res.data.results[0])
    }
}

export default MarvelService
