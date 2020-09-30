import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CarteleraResponse, Movie } from '../interfaces/cartelera-response';
import { tap, map, catchError } from 'rxjs/operators';
import { MovieResponse } from '../interfaces/movie-response';
import { CreditsResponse, Cast } from '../interfaces/credits-response';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private baseUrl = 'https://api.themoviedb.org/3';
  private carteleraPage = 1;
  public cargando = false;

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:typedef
  get params(){
    return {
      api_key: '68774ab58f2a62f89033a3139880c043',
      language: 'es-ES',
      page: this.carteleraPage.toString()
    };
  }

  // tslint:disable-next-line:typedef
  resetCarteleraPages() {
    this.carteleraPage = 1;
  }

  getCartelera(): Observable<Movie[]>{

    if (this.cargando) {
      return of([]);
    }

    this.cargando = true;
    return this.http.get<CarteleraResponse>(`${this.baseUrl}/movie/now_playing?`,
    {
      params: this.params
    })
    .pipe(
      map ((resp) => resp.results),
      tap( () => {
        this.carteleraPage += 1;
        this.cargando = false;
      })
    );
  }

  buscarPeliculas(texto: string): Observable<Movie[]>{
    const params = {...this.params, page: '1', query: texto};
    return this.http.get<CarteleraResponse>(`${this.baseUrl}/search/movie`, {
      params
    })
    .pipe(
      map( resp => resp.results)
    );
  }

  // tslint:disable-next-line:typedef
  getPeliculaDetalle(id: string){
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/${id}`, {
      params: this.params
    }).pipe(
      catchError(err => of(null))
    );
  }

  // tslint:disable-next-line:typedef
  getCast(id: string): Observable<Cast[]>{
    return this.http.get<CreditsResponse>(`${this.baseUrl}/movie/${id}/credits?`, {
      params: this.params
    })
    .pipe(
      map(resp => resp.cast),
      catchError(err => of([]))
    );
  }

}
