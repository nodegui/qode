#include <QDir>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QJsonValue>
#include <QtGlobal>
#include <QCoreApplication>

namespace QodeHelpers
{
void setConsoleVisibility(QJsonDocument &conf);
void setStartFile(QJsonDocument &conf);
void addLibraryPaths(QJsonDocument &conf);
QJsonDocument readConfig();
} // namespace QodeHelpers