package com.beerbuddy.core.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.beerbuddy.core.model.Beer;

public interface BeerRepository extends JpaRepository<Beer, Long> {
	
	@Query("select distinct (b.type) from Beer b order by b.type asc")
	public List<String> findTypes();
	
	public Page<Beer> findByType(String type, Pageable page);
	
	@Query("select distinct (b.brewer) from Beer b order by b.brewer asc")
	public List<String> findBrewers();
	
	public Page<Beer> findByBrewer(String brewer, Pageable page);
	
	@Query("select distinct (b.name) from Beer b order by b.name asc")
	public List<String> findNames();
	
	public Page<Beer> findByName(String name, Pageable page);
}
