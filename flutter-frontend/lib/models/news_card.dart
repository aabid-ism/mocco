class NewsCard {
  final String? id;
  final String? title;
  final String? description;
  final String? imageUrl;

  NewsCard(
      {required this.id,
      required this.title,
      required this.description,
      this.imageUrl});
}
