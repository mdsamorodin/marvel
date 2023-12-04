import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {
    const [comics, setComics] = useState([]),
        [newItemLoading, setNewItemLoading] = useState(false),
        [offset, setOffset] = useState(210),
        [comicsEnded, setComicsEnded] = useState(false)

    const { loading, error, getAllComics } = useMarvelService()

    const onComicsLoaded = (newComics) => {
        let ended = false
        if (newComics.length < 8) {
            ended = true
        }
        setComics(comics => [...comics, ...newComics])
        setNewItemLoading(false)
        setOffset(offset => offset + 8)
        setComicsEnded(ended)
    }

    const updateComics = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset).then(onComicsLoaded)
    }

    useEffect(() => {
        updateComics(offset, true)
    }, [])

    function renderItems(arr) {
        const items = arr.map((item) => {
            return (
                <li
                    className="comics__item"
                    key={item.id}
                >
                    <Link to={`/comics/${item.id}`} >
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comics)
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => updateComics(offset)}
                style={{ display: comicsEnded ? 'none' : 'block' }}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;