import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    const _apiKey = 'apikey=bbce2348c626267f563208230cd8f734'
    const _baseOffsetChar = 210
    const _baseOffsetComicbook = 210

    const _transformCharacter = (char) => {
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

    const getAllCharacters = async (offset = _baseOffsetChar) => {
        const res = await request(
            `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
        );
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    };

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || "There is no description",
            pages: comics.pageCount ? `${comics.pageCount} p.` : "No information about the number of pages",
            language: comics.textObjects[0]?.language || "en-us",
            price: comics.prices[0].price ? `${comics.prices[0].price}$` : "not available",
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
        }
    }

    const getAllComics = async (offset = _baseOffsetComicbook) => {
        const res = await request(
            `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`
        );
        return res.data.results.map(_transformComics);
    };

    const getComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    };

    return { loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComics }
}

export default useMarvelService
