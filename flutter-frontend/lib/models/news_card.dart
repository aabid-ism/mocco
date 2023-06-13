class NewsCard {
  final String? id;
  final String? title;
  final String? description;
  final String? imageUrl;
  final String? sourceUrl;
  final String? author;
  final String? sourceName;
  final List<String?>? tags;

  NewsCard(
      {required this.id,
      required this.title,
      required this.description,
      this.imageUrl,
      this.sourceUrl,
      this.author,
      this.sourceName,
      this.tags});
}
