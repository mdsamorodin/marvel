import { Component } from 'react';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/errorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charsEnded: false
    }

    componentDidMount() {
        this.updateChars()
    }

    marvelService = new MarvelService()

    onCharsLoaded = (newChars) => {
        let ended = false
        if (newChars.length < 9) {
            ended = true
        }

        this.setState(({ offset, chars }) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charsEnded: ended
        }))
    }

    onCharsLoading = () => {
        this.setState({ newItemLoading: true })
    }

    onError = () => {
        this.setState({ loading: false, error: true })
    }

    updateChars = (offset) => {
        this.onCharsLoading()
        this.marvelService.getAllCharacters(offset).then(this.onCharsLoaded).catch(this.onError)
    }

    renderItems(chars) {
        const block = chars.map((char) => {
            return (
                <li className="char__item" key={char.id} onClick={() => this.props.onCharSelected(char.id)}>
                    <img src={char.thumbnail} alt={char.name} style={char.thumbnail.indexOf('image_not_available') > -1 ? { objectFit: 'contain' } : null} />
                    <div className="char__name">{char.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {block}
            </ul>
        )
    }

    render() {
        const { chars, loading, error, newItemLoading, offset, charsEnded } = this.state
        const block = this.renderItems(chars)
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? block : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.updateChars(offset)}
                    style={{ display: charsEnded ? 'none' : 'block' }}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;