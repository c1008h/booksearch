import React, {useState, useEffect} from 'react';
import { Button, TextField, Typography, SelectChangeEvent, FormControl, MenuItem, Box, Select, InputLabel } from '@mui/material';

interface Book {
  title: string;
  authors: string[];
  first_publish_year: number;
  isbn: string[];
  number_of_pages: number;
}
interface SearchResult {
  docs: Book[];
}
const SortOptions = {
  RELEVANCE: 'relevance',
  YEAR_OLDEST_FIRST: 'yearOldestFirst',
  YEAR_NEWEST_FIRST: 'yearNewestFirst',
};

const ITEMS_PER_PAGE = 12;
const MAX_HEIGHT = 200;

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [sortOption, setSortOption] = useState<string | ''>(SortOptions.RELEVANCE);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const APIURL = 'https://openlibrary.org/search.json?q='

  useEffect(() => {
      let isMounted = true;

      const fetchData = async () => {
        try {
          const response = await fetch(APIURL + 'spongebob')
          const data: SearchResult = await response.json()
          if(isMounted) setBooks(data.docs)

        } catch (error) {
          console.log("Error loading books:", error)
        }
      }
      fetchData()

      return () => {
        isMounted = false;
      }
  }, [])
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (searchTerm.trim().length < 3) return; 
      try {
        const response = await fetch(APIURL + searchTerm)
        const data: SearchResult = await response.json()
        // const sortedBooks = sortByRelevance ? data.docs : data.docs.sort((a, b) => a.first_publish_year - b.first_publish_year);
        let sortedBooks;
        if (sortOption === SortOptions.RELEVANCE) {
          sortedBooks = data.docs;
        } else if (sortOption === SortOptions.YEAR_OLDEST_FIRST) {
          sortedBooks = [...data.docs].sort((a, b) => a.first_publish_year - b.first_publish_year);
        } else if (sortOption === SortOptions.YEAR_NEWEST_FIRST) {
          sortedBooks = [...data.docs].sort((a, b) => b.first_publish_year - a.first_publish_year);
        }
        if(isMounted) setBooks(sortedBooks || [])
      } catch (error) {
        console.log("Error fetching data:", error)
      }
    }
    fetchData()

    return () => {
      isMounted = false;
    }
  }, [searchTerm, sortOption])

  const handleChange = (event: SelectChangeEvent<string>) => setSortOption(event.target.value);
  const handleNextPage = () => setCurrentPage(currentPage+1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = books.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="App">
      <div style={{marginTop:'0',height:'150px', background:'pink', display:'flex', alignItems:'center', padding:'0 5%'}}>
        <h2 style={{marginRight:'auto'}}>Book Search</h2>
        <div>
          <TextField 
            style={{background:'white'}}
            label="Search for a book"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginBottom: '1rem' }}
          />
          <FormControl style={{ width: '150px',background:'white' }}>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select
              name="sort"
              labelId="sort-label"
              id="sort"
              value={sortOption}
              onChange={handleChange}
            >
              <MenuItem value={SortOptions.RELEVANCE}>Relevance</MenuItem>
              <MenuItem value={SortOptions.YEAR_OLDEST_FIRST}>Year (Oldest First)</MenuItem>
              <MenuItem value={SortOptions.YEAR_NEWEST_FIRST}>Year (Newest First)</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <Box style={{display:'flex', flexWrap: 'wrap', gap:20, paddingLeft: '5%',margin:'10px auto', justifyContent: 'flex-start',  }}>
        {currentItems.map((book, index) => (
          <div 
            key={index} 
            style={{ 
              marginBottom: '1rem', 
              border:'1px black solid', 
              borderRadius:10, 
              width:'20%', 
              padding:5,
              height:'350px',
              overflow: 'hidden' 
            }}
          >
            <Typography variant="h6">{book.title ? book.title : 'N/A'}</Typography>
            <Typography variant="subtitle1">Author(s): {book.authors ? book.authors.join(', ') : 'N/A'}</Typography>
            <Typography variant="body1">Year: {book.first_publish_year ? book.first_publish_year : 'N/A'}</Typography>
            <Typography variant="body1">ISBN: {book.isbn ? book.isbn.join(', ') : 'N/A'}</Typography>
            <Typography variant="body1">Pages: {book.number_of_pages ? book.number_of_pages : 'N/A'}</Typography>        
          </div>
        ))}
      </Box>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</Button>
        <Typography style={{ margin: '0 10px' }}>Page {currentPage}</Typography>
        <Button onClick={handleNextPage} disabled={currentItems.length < ITEMS_PER_PAGE}>Next Page</Button>
      </div>
      <footer style={{background:'pink', height:'150px', textAlign:'center', justifyContent:'center'}}>
        <h2 style={{fontWeight:'bold'}}>By Chris Hong</h2>
      </footer>
    </div>
  );
}

export default App;
