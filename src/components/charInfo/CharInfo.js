import { Component } from 'react';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton'
import MarvelService from '../../services/MarvelService';

import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    componentDidMount() {
        this.updateChar()
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar()
        }
    }

    marvelService = new MarvelService()

    onCharLoaded = (char) => {
        this.setState({ char, loading: false })
    }

    onCharLoading = () => {
        this.setState({ loading: true })
    }

    onError = () => {
        this.setState({ loading: false, error: true })
    }

    updateChar = () => {
        const { charId } = this.props
        if (!charId) {
            return;
        }
        this.onCharLoading()
        this.marvelService.getCharacter(charId).then(this.onCharLoaded).catch(this.onError)
    }

    render() {
        const { char, loading, error } = this.state
        const skeleton = error || loading || char ? null : <Skeleton />
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !char) ? <View char={char} /> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={char.thumbnail.indexOf('image_not_available') > -1 ? { objectFit: 'contain' } : null} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.length > 0 ?
                        comics.map((item, i) => {
                            return (
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            )
                        }).slice(0, Math.min(10, comics.length)) : 'There are no comics with this character'
                }
            </ul>
        </>
    )
}

export default CharInfo;