const path = require( 'path' );

const Movie = require( '../models/movie' );
const { move } = require('../routes/home');

const ITEMS_PER_CONTAINER_LIST = 5;

exports.getIndex = async ( req, res) => {
    const page = req.query.page || 1;

    try {
        const listPhimBo = await Movie.find( { typeFilm: 'Phim-Bộ' } )
            .limit( 18 );
        const listPhimLe = await Movie.find( { typeFilm: 'Phim-Lẻ' } )
            .limit( 18 );
        const listChieuRap = await Movie.find( { typeFilm: 'Phim-Chiếu-Rạp' } )
            .limit( 18 );
        const HoatHinh = await Movie.find( { typeFilm: 'Hoạt-Hình' } )
            .limit( 18 );
        const listPhimSapChieu = await Movie.find( { typeFilm: 'Phim-Sắp-Chiếu' } )
            .limit( 6 );

        res.render( 'home/HomePage/index.ejs', {
            listPhimBo: listPhimBo,
            listPhimLe: listPhimLe,
            listChieuRap: listChieuRap,
            HoatHinh: HoatHinh,
            listPhimSapChieu: listPhimSapChieu,
            modeCategory:false,
            pageTitle: 'TRANG CHU',
            path: '/'
        } )
    }
    catch ( error ) {
        console.log( error )
    }
}

exports.getMovieDetail = async( req,res) =>{
    try {

        const listPhimChieuRap = await Movie.find( { typeFilm: 'Phim-Chiếu-Rạp' } )
            .limit( 18 );

        const listPhimSapChieu = await Movie.find( { typeFilm: 'Phim-Sắp-Chiếu' } )
            .limit( 6 );

        movieDetail = await Movie.findOne( { name: req.params.name } );
        if ( movieDetail === null ) {
            movieDetail = 'Undified';
        }
        res.render( 'home/MovieDetail/index.ejs', {
            listPhimChieuRap: listPhimChieuRap,
            movie: movieDetail,
            listPhimSapChieu: listPhimSapChieu
        } )
    } catch ( error ) {
        console.log( error )
    }
}

exports.getWatchMovie = async ( req, res) => {
    try {
        const listPhimChieuRap = await Movie.find( { typeFilm: 'Phim-Chiếu-Rạp' } )
            .limit( 18 )

        const movieName = req.params.name;

        const movieDetail = await Movie.findOne( { name: movieName } );

        res.render( 'home/VideoMovie/index.ejs', {
            movie: movieDetail,
            listPhimChieuRap: listPhimChieuRap
        } )

    } catch ( error ) {
        console.log( error )
    }
}

exports.getCategory = async( req, res) =>{
    try {
        const getCategory = req.params.category
        const listMove = await Movie.find()

        const listPhimSapChieu = await Movie.find( { typeFilm: 'Phim-Sắp-Chiếu' } )
        .limit( 6 );

        listMovieCategory = listMove.filter((movie) =>{
            return (movie.typeFilm == getCategory || movie.national == getCategory)
        })        
        
        res.render('home/HomePage/index.ejs',{
            listCategory : listMovieCategory,
            listPhimSapChieu:listPhimSapChieu,
            nameCategory: getCategory,
            modeCategory: true
        })
    } catch (error) {
        console.log(error);
    }
}

exports.searchMovie = async(req,res)=>{
    try {
        const keywordSearch = req.body.Search
        const listMovie = await Movie.find();
        const listMovieDetail = listMovie.filter(value =>{
            return (value.name.toUpperCase().includes( keywordSearch.toUpperCase() ) || 
                    value.typeFilm.toUpperCase().includes(keywordSearch.toUpperCase()))
        })

        const listPhimSapChieu = await Movie.find( { typeFilm: 'Phim-Sắp-Chiếu' } )
        .limit( 6 );

        res.render('home/HomePage/index.ejs',{
            listCategory : listMovieDetail,
            listPhimSapChieu:listPhimSapChieu,
            nameCategory: keywordSearch,
            modeCategory: true
        })
    } catch (error) {
        console.log(error);
    }
}