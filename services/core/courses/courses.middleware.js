const express = require('express');
const router = express.Router();
const url = require('url');

module.exports = (server) => {

	router.get('/courses', (req, res, next) => {
		let url_parts = url.parse(req.originalUrl, true),
			query = url_parts.query,
			from = query.start || 0,
			to = +query.start + +query.count,
			sort = query.sort,
			queryStr = query.query,
			courses = server.db.getState().courses;
		
			if (!!query.textFragment) {
				courses = courses.filter((course) => course.name.concat(course.description).toUpperCase().indexOf(query.textFragment.toUpperCase()) >= 0);
			}

		if (courses.length < to || !to) {
			to = courses.length;
		}
		courses = courses.slice(from, to);
		
		res.json(courses);
	});

	router.post('/course_delete', (req, res, next) => {
		const id = +req.body.id;
		if(id){
            const delIdx = server.db.getState().courses.findIndex(course => course.id === id);
			if(delIdx > -1){
                server.db.getState().courses.splice(delIdx, 1);
                res.json({msg: 'ok'});
			}
			else
				res.status(401).send(`Could not find Course with "id" = ${id}`);
		}
		else
			res.status(401).send('Course id was not provided');
	});

	router.post('/course_update', (req, res, next) => {
		const updatedCourse = req.body.updatedCourse;
		if(updatedCourse){
			const curCourse = server.db.getState().courses.find(course => course.id === updatedCourse.id);
			if(curCourse){
				Object.keys(curCourse).forEach(key => curCourse[key] = updatedCourse[key]);
				res.json({msg: 'ok'});
			}
			else
				res.status(401).send(`Could not find Course with "id" = ${updatedCourse.id}`)
		}
		else
            res.status(401).send('Course for update was not provided');
	});

	router.post('/course_search', (req, res, next) => {
		const searchWord = req.body.searchWord;
		if(searchWord){
			res.json(
                server.db.getState().courses.filter(course =>
					course.name.toLowerCase().indexOf(searchWord.toLowerCase()) > -1
					|| course.description.toLowerCase().indexOf(searchWord.toLowerCase()) > -1
				)
			);
		}
		else
			res.status(401).send('No search word provided');
	});

	return router;
};
