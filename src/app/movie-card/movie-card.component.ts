import { Component, OnInit } from '@angular/core';

// API Calls
// import { GetAllMoviesService, AddFavoriteMovieService } from '../fetch-api-data.service';
import { FetchApiDataService } from '../fetch-api-data.service';

// Angular material
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovieIds: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * retrieve all movies
   **/ 
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * check if movie is in favorites
   **/ 
  getFavoriteMovies(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.favoriteMovieIds = resp.FavoriteMovies;
    });
  }

  // Checks the movieID against the list of favorites and returns a boolean.
  isFavorite(movieID: string): boolean {
    console.log("Movie ID " + movieID + "favorite check");
    return this.favoriteMovieIds.includes(movieID);
  };
 
  /**
   * add or delete movie from favorites
   **/ 
  onToggleFavoriteMovie(id: string): any {
    if (this.isFavorite(id)) {
      this.fetchApiData.removeFavorite(id).subscribe((resp: any) => {
        this.snackBar.open('Removed from favorites!', 'OK', {
          duration: 2000,
        });
      });
      const index = this.favoriteMovieIds.indexOf(id);
      return this.favoriteMovieIds.splice(index, 1);
      // this.getFavoriteMovies();
    } else {
      this.fetchApiData.addFavorite(id).subscribe((response: any) => {
        this.snackBar.open('Added to favorites!', 'OK', {
          duration: 2000,
        });
      });
    }
    return this.favoriteMovieIds.push(id);
    // this.getFavoriteMovies();
  }

}